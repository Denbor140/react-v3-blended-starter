import * as Yup from "yup";
import { Formik, ErrorMessage, Field, Form, FormikHelpers } from "formik";

import css from "./EditPostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";

interface EditPostFormProps {
  initialValues: EditPostFomrValues;
  onClose: () => void;
}

interface EditPostFomrValues {
  id: number;
  title: string;
  body: string;
}

const EditPostFormShema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(30, "Maximum 50 characters")
    .required("Title is required"),
  body: Yup.string().max(500, "Maximum 500 characters").required("Content is required"),
});

export default function EditPostForm({ initialValues, onClose }: EditPostFormProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: editPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post edited successfully!");
      onClose();
    },
    onError() {
      console.log("error Edit Post");
    },
  });

  const editeNote = (values: EditPostFomrValues, actions: FormikHelpers<EditPostFomrValues>) => {
    mutate(values);
    actions.resetForm();
  };
  return (
    <Formik initialValues={initialValues} validationSchema={EditPostFormShema} onSubmit={editeNote}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}

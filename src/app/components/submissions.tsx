"use client"

import { Formik, Field, Form } from 'formik';

export default function GroupForm() {
    return (
        <Formik
            initialValues={{
                name: '',
                password: '',
            }}

            onSubmit={() => {

            }}
        >
            <Form>
                <Field id="name" name="name" placeholder="Group Name" />
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    )
}
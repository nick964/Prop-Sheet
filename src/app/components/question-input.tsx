import { Formik, Field, Form } from 'formik';
import { Question } from '../models/question';

export default function QuestionInput({question} : {question:Question}) {

    const questionType = question.questionOptions[0].input_type;
    const valueOptions = question.questionOptions[0].option.split(',');

    const radioOptions = valueOptions.map(opt => (
        <label key={opt}>
        <Field type="radio" name="picked" value={opt} />
        {opt}
        </label>

    ));

    
    return (
        <Formik
            initialValues={{
                picked: '',
            }}

            onSubmit={async (values) => {
                await new Promise((r) => setTimeout(r, 500));
                alert(JSON.stringify(values, null, 2));
              }}
        >
            <Form>
            <div id="my-radio-group">{question.text}</div>
                <div role="group" aria-labelledby="my-radio-group">
                    <label>
                    <Field type="radio" name="picked" value="One" />
                    One
                    </label>
                    <label>
                    <Field type="radio" name="picked" value="Two" />
                    Two
                    </label>
                </div>

                <button type="submit">Submit</button>
            </Form>

        </Formik>
    )
}
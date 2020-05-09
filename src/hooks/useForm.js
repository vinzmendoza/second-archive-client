import { useState } from "react";

const useValidate = (callback, validate) => {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    const onSubmit = event => {
        event.preventDefault();
        setErrors(validate(values));
        callback();
    };

    const onChange = event => {
        event.persist();
        setValues(values => ({
            ...values,
            [event.target.name]: event.target.value
        }));
    };

    return {
        onChange,
        onSubmit,
        values,
        errors
    };
};

export default useValidate;

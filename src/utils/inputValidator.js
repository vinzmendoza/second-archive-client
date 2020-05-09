export function inputValidator(values) {
    let errors = {};
    if (!values.addInput) {
        errors.addInput = "Input is required.";
    }
    return errors;
}

export function loginValidator(values) {
    let errors = {};
    if (!values.username) {
        errors.username = "Username is required.";
    }
    if (!values.password) {
        errors.password = "Password is required.";
    }
    return errors;
}

export function registerValidator(values) {
    let errors = {};
    if (!values.username) {
        errors.username = "Username is required.";
    }
    if (!values.password) {
        errors.password = "Password is required.";
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm password is required.";
    }
    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Password must match.";
    }
    return errors;
}

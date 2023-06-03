import { isbn } from "@form-validation/validator-isbn";
import { TITLE_ERROR_MESSAGE, REQUIRED_FIELD, ISBN_ERROR_MESSAGE, TIME_ERROR_MESSAGE } from "./constants";

export const titleValidation = {
    required: REQUIRED_FIELD,
    maxLength: { value: 100, message: TITLE_ERROR_MESSAGE },
};

export const timeValidation = {
    validate: (value) => {
        if (value > 2023 || value < 0) {
            return TIME_ERROR_MESSAGE;
        }

        return true;
    },
};

export const isbnValidation = {
    validate: (value) => {
        if (
            value &&
            !isbn().validate({
                value: value,
            }).valid
        ) {
            return ISBN_ERROR_MESSAGE;
        }

        return true;
    },
};

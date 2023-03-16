import { ApplicationError } from "@/protocols";

export function BadRequestError(): ApplicationError {
    return {
        name: "BadRequestError",
        message: "Bad request"
    }
}
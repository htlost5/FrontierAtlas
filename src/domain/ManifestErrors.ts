export class ManifestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ManifestError"
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "Validation Error"
    }
}

export class SizeMismatchError extends Error {
    constructor() {
        super("Size mismatch");
        this.name = "SizeMismatchError"
    }
}

export class Sha256MismatchError extends Error {
    constructor() {
        super("Sha256 mismatch");
        this.name = "Sha256MismatchError";
    }
}

export class VersionMismatchError extends Error {
    constructor() {
        super("Version mismatch");
        this.name = "VersionMismatchError"
    }
}

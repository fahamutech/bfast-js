export interface FileLike {
    name: string

    type: string

    size: number

    lastModified: number

    stream(): { [Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array> }

    [Symbol.toStringTag]: string
}

/**
 * This interface reflects possible values of each FormData entry
 */
export type FormDataEntryValue = string | FileLike

/**
 * This interface reflects minimal shape of the FormData
 */
export interface FormDataLike {
    append(name: string, value: unknown, filename?: string): void

    getAll(name: string): FormDataEntryValue[]

    entries(): Generator<[string, FormDataEntryValue]>

    [Symbol.iterator](): Generator<[string, FormDataEntryValue]>

    [Symbol.toStringTag]: string
}


const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

/**
 * Generates a boundary string for FormData encoder.
 *
 * @param size The size of the resulting string
 */
function createBoundary(size: number): string {
    let res = ""

    while (size--) {
        // I use bitwise `<<` for slightly more performant string fill.
        // It will do basically the same thing as `Math.trunc()`,
        // except it only support signed 32-bit integers.
        // Because the result of this operation will always be
        // a number in range `0` and `alphabet.length - 1` (inclusive),
        // we don't need `Math.floor()` too.
        /* eslint no-bitwise: ["error", {"allow": ["<<"]}] */
        res += alphabet[(Math.random() * alphabet.length) << 0]
    }

    return res
}


/**
 * Normalize non-File value following the spec requirements.
 *
 * See: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#multipart-form-data
 *
 * @param value A value to normalize
 */
const normalize = (value: unknown): string => String(value)
    .replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")

/**
 * Check if given object is FormData
 *
 * @param value an object to test
 */
const isFormData = (value?: unknown): value is FormDataLike => Boolean(
    (value as FormDataLike)
    && isFunction((value as FormDataLike).constructor)
    && (value as FormDataLike)[Symbol.toStringTag] === "FormData"
    && isFunction((value as FormDataLike).append)
    && isFunction((value as FormDataLike).getAll)
    && isFunction((value as FormDataLike).entries)
    && isFunction((value as FormDataLike)[Symbol.iterator])
)

const isFunction = (value: unknown): value is Function => (
    typeof value === "function"
)

const escapeName = (name: unknown) => String(name)
    .replace(/\r/g, "%0D") // CR
    .replace(/\n/g, "%0A") // LF
    .replace(/"/g, "%22")


export const isFile = (value?: unknown): value is FileLike => Boolean(
    (value as FileLike)
    && typeof (value as FileLike) === "object"
    && isFunction((value as FileLike).constructor)
    && ["File", "Blob"].includes((value as FileLike)[Symbol.toStringTag])
    && isFunction((value as FileLike).stream)
    && (value as FileLike).name != null
    && (value as FileLike).size != null
    && (value as FileLike).lastModified != null
)

export class FormDataEncoder {
    /**
     * Returns boundary string
     */
    readonly boundary: string

    /**
     * Returns Content-Type header for multipart/form-data
     */
    readonly contentType: string

    /**
     * Returns headers object with Content-Type and Content-Length header
     */
    readonly headers: {
        "Content-Type": string
        "Content-Length": string
    }

    readonly #CRLF: string

    readonly #CRLF_BYTES: Uint8Array

    readonly #CRLF_BYTES_LENGTH: number

    readonly #DASHES = "-".repeat(2)

    /**
     * TextEncoder instance
     */
    readonly #encoder: TextEncoder

    /**
     * Returns form-data footer bytes
     */
    readonly #footer: Uint8Array

    /**
     * FormData instance
     */
    readonly #form: FormDataLike

    /**
     * Creates a multipart/form-data encoder.
     *
     * @param form - FormData object to encode. This object must be a spec-compatible FormData implementation.
     * @param boundary - An optional boundary string that will be used by the encoder. If there's no boundary string is present, Encoder will generate it automatically.
     *
     * @example
     *
     * import {Encoder} from "form-data-encoder"
     * import {FormData} from "formdata-node"
     *
     * const fd = new FormData()
     *
     * fd.set("greeting", "Hello, World!")
     *
     * const encoder = new Encoder(fd)
     */
    constructor(form: FormDataLike, boundary: string = createBoundary(16)) {
        if (!isFormData(form)) {
            throw new TypeError("Expected first argument to be a FormData instance.")
        }

        if (typeof boundary !== "string") {
            throw new TypeError("Expected boundary to be a string.")
        }

        this.boundary = `form-data-boundary-${boundary}`
        this.contentType = `multipart/form-data; boundary=${this.boundary}`

        this.#encoder = new TextEncoder()

        this.#CRLF = "\r\n"
        this.#CRLF_BYTES = this.#encoder.encode(this.#CRLF)
        this.#CRLF_BYTES_LENGTH = this.#CRLF_BYTES.byteLength

        this.#form = form
        this.#footer = this.#encoder.encode(
            `${this.#DASHES}${this.boundary}${this.#DASHES}${this.#CRLF.repeat(2)}`
        )

        this.headers = Object.freeze({
            "Content-Type": this.contentType,
            "Content-Length": String(this.getContentLength())
        })
    }

    #getFieldHeader(name: string, value: any): Uint8Array {
        let header = ""

        header += `${this.#DASHES}${this.boundary}${this.#CRLF}`
        header += `Content-Disposition: form-data; name="${escape(name)}"`

        if (isFile(value)) {
            header += `; filename="${escape(value.name)}"${this.#CRLF}`
            header += `Content-Type: ${value.type || "application/octet-stream"}`
        }

        return this.#encoder.encode(`${header}${this.#CRLF.repeat(2)}`)
    }

    /**
     * Returns form-data content length
     */
    getContentLength(): number {
        let length = 0

        for (const [name, value] of this.#form) {
            length += this.#getFieldHeader(name, value).byteLength

            length += isFile(value)
                ? value.size
                : this.#encoder.encode(normalize(value)).byteLength

            length += this.#CRLF_BYTES_LENGTH
        }

        return length + this.#footer.byteLength
    }

    /**
     * Creates an iterator allowing to go through form-data parts (with metadata).
     * This method **will not** read the files.
     *
     * Using this method, you can convert form-data content into Blob:
     *
     * @example
     *
     * import {Readable} from "stream"
     *
     * import {Encoder} from "form-data-encoder"
     *
     * import {FormData} from "formdata-polyfill/esm-min.js"
     * import {fileFrom} from "fetch-blob/form.js"
     * import {File} from "fetch-blob/file.js"
     * import {Blob} from "fetch-blob"
     *
     * import fetch from "node-fetch"
     *
     * const fd = new FormData()
     *
     * fd.set("field", "Just a random string")
     * fd.set("file", new File(["Using files is class amazing"]))
     * fd.set("fileFromPath", await fileFrom("path/to/a/file.txt"))
     *
     * const encoder = new Encoder(fd)
     *
     * const options = {
     *   method: "post",
     *   body: new Blob(encoder, {type: encoder.contentType})
     * }
     *
     * const response = await fetch("https://httpbin.org/post", options)
     *
     * console.log(await response.json())
     */
    * values(): Generator<Uint8Array | any, void, undefined> {
        for (const [name, value] of this.#form.entries()) {
            yield this.#getFieldHeader(name, value)

            yield isFile(value) ? value : this.#encoder.encode(normalize(value))

            yield this.#CRLF_BYTES
        }

        yield this.#footer
    }

    /**
     * Creates an async iterator allowing to perform the encoding by portions.
     * This method **will** also read files.
     *
     * @example
     *
     * import {Readable} from "stream"
     *
     * import {FormData, File, fileFromPath} from "formdata-node"
     * import {Encoder} from "form-data-encoder"
     *
     * import fetch from "node-fetch"
     *
     * const fd = new FormData()
     *
     * fd.set("field", "Just a random string")
     * fd.set("file", new File(["Using files is class amazing"]))
     * fd.set("fileFromPath", await fileFromPath("path/to/a/file.txt"))
     *
     * const encoder = new Encoder(fd)
     *
     * const options = {
     *   method: "post",
     *   headers: encoder.headers,
     *   body: Readable.from(encoder.encode()) // or Readable.from(encoder)
     * }
     *
     * const response = await fetch("https://httpbin.org/post", options)
     *
     * console.log(await response.json())
     */
    async* encode(): AsyncGenerator<Uint8Array, void, undefined> {
        for (const part of this.values()) {
            if (isFile(part)) {
                yield* part.stream()
            } else {
                yield part
            }
        }
    }

    /**
     * Creates an iterator allowing to read through the encoder data using for...of loops
     */
    [Symbol.iterator](): Generator<Uint8Array | any, void, undefined> {
        return this.values()
    }

    /**
     * Creates an **async** iterator allowing to read through the encoder data using for-await...of loops
     */
    [Symbol.asyncIterator](): AsyncGenerator<Uint8Array, void, undefined> {
        return this.encode()
    }
}

/**
 * @deprecated Use FormDataEncoder to import the encoder class instead
 */
/* c8 ignore next */
export const Encoder = FormDataEncoder

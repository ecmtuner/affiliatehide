import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8)

export function generateCode(): string {
  return nanoid()
}

export function generateToken(): string {
  return customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 32)()
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

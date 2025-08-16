import { Password } from "../utils/Password";

jest.mock("../utils/Password");
export const MockedPassword = Password as jest.Mocked<typeof Password>;
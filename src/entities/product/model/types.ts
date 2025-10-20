import { z } from "zod";
import { ProductSchema } from "./validation";

export type Product = z.infer<typeof ProductSchema>;

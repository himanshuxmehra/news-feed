"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignIn() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const token = useAuth((state) => state.token);
    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    const setAuth = useAuth((state) => state.setAuth);
    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: SignInValues) {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include", // Important for cookies
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Sign in failed");
            }

            // Handle successful login
            toast({
                title: "Success",
                description: "Signed in successfully",
            });

            setAuth(result.token, result.user);

            router.push("/");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Sign in failed",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="flex-col items-center justify-center my-64 w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Sign in to App
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/signup"
                                className="text-primary hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

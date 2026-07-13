
"use client"

import { register } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { Flex, Text, TextField, Button, Box, Card } from '@radix-ui/themes';

import { Box, Card, Flex, Text, Heading, TextField, Button, Callout } from '@radix-ui/themes';

// import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const queryClient = useQueryClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        setIsLoading(true)
        const { name, email, password } = formData
        try {
            await register(name, email, password)
            await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
            router.push("/dashboard")
        } catch (err: any) {
            console.error("Register failed:", err);
            setError(err.message || "Something went wrong during registration.");
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <Box maxWidth="420px" mx="auto" pt="9" mt="9" >
            <Flex justify="center" mb="6">
                <Text size="6" weight="bold" >Dsync</Text>
            </Flex>

            {error && (
                <Callout.Root color="red" variant="soft" mb="4">
                    <Callout.Icon>
                    </Callout.Icon>
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}

            <Card size="3">
                <form onSubmit={handleSubmit}>
                    <Flex direction="column" gap="4">
                        <Box mb="2">
                            <Heading as="h1" size="6" align="center" weight="bold">
                                Create Account
                            </Heading>
                        </Box>

                        <Flex direction="column" gap="1">
                            <Text as="label" htmlFor="name" size="2" weight="medium" color="gray">
                                Name
                            </Text>
                            <TextField.Root
                                id="name"
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                size="2"
                                radius="small"
                            />
                        </Flex>

                        <Flex direction="column" gap="1">
                            <Text as="label" htmlFor="email" size="2" weight="medium" color="gray">
                                Email
                            </Text>
                            <TextField.Root
                                id="email"
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                size="2"
                                radius="small"
                            />
                        </Flex>

                        <Flex direction="column" gap="1">
                            <Text as="label" htmlFor="password" size="2" weight="medium" color="gray">
                                Password
                            </Text>
                            <TextField.Root
                                id="password"
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                size="2"
                                radius="small"
                            />
                        </Flex>

                        <Flex direction="column" gap="1">
                            <Text as="label" htmlFor="confirmPassword" size="2" weight="medium" color="gray">
                                Confirm Password
                            </Text>
                            <TextField.Root
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                size="2"
                                radius="small"
                            />
                        </Flex>

                        <Button type="submit" size="3" variant="solid" loading={isLoading} mt="2">
                            Register
                        </Button>
                    </Flex>
                </form>
            </Card>

            <Flex justify="center" mt="4">
                <Text size="2" color="gray">
                    Already have an account?{' '}
                    <Link href="/login" >
                        Login
                    </Link>
                </Text>
            </Flex>
        </Box>
    );
};

export default Register;

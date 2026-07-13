
"use client"
import { logIn } from "@/services/auth.service";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Card, Flex, Text, Heading, TextField, Button, Callout } from '@radix-ui/themes';
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        setIsLoading(true)
        const { email, password } = formData
        try {
            await logIn(email, password)
            console.log("dashboard hit")
            await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
            router.push("/dashboard")
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Something went wrong during Login.");
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
                                Login
                            </Heading>
                        </Box>


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

                        <Button type="submit" size="3" variant="solid" loading={isLoading} mt="2">
                            Login
                        </Button>
                    </Flex>
                </form>
            </Card>

            <Flex justify="center" mt="4">
                <Text size="2" color="gray">
                    Don{"'"}t have an account?{' '}
                    <Link href="/register" >
                        Register
                    </Link>
                </Text>
            </Flex>
        </Box>

    );
};

export default Login;

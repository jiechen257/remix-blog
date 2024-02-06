import { Button, Input } from "@nextui-org/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { prisma } from "~/prisma.server";
import { userSessionStorage } from "../session.server";

export const action = async (c: ActionFunctionArgs) => {
	const formData = await c.request.formData();

	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
	});
	if (!user || user.password !== password) {
		return json({
			success: false,
			errors: {
				username: "用户名或密码错误",
				password: "用户名或密码错误",
			},
		});
	}

	const session = await userSessionStorage.getSession(
		c.request.headers.get("Cookie")
	);
	session.set("username", username);

	return redirect("/", {
		headers: {
			"Set-Cookie": await userSessionStorage.commitSession(session),
		},
	});
};

export default function Page() {
	const actionData = useActionData<typeof action>();
	const errors = actionData?.errors;

	return (
		<Form method="POST">
			<div className="flex flex-col p-12 gap-5">
				<Input
					label="用户名"
					name="username"
					isInvalid={!!errors?.username}
					errorMessage={errors?.username}
				/>
				<Input
					type="password"
					label="密码"
					name="password"
					isInvalid={!!errors?.password}
					errorMessage={errors?.password}
				/>
				<div className="flex justify-between text-center w-60">
					<Button type="submit" color="primary">
						登录
					</Button>
					<Link to="/signup">
						<Button>注册</Button>
					</Link>
				</div>
			</div>
		</Form>
	);
}

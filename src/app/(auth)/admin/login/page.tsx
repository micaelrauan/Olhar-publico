import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <main className="container max-w-[440px] py-20">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Acesso editorial
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Entre com a conta de administração cadastrada no banco de dados.
        </p>
      </div>
      <LoginForm searchParams={searchParams} />
    </main>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card className="rounded-none border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Credenciais de acesso</CardTitle>
        <CardDescription>
          Informe seu e-mail e senha para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (data) => {
            "use server";
            await signIn("credentials", {
              email: data.get("email"),
              password: data.get("password"),
              redirectTo: "/admin",
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">
              E-mail
            </label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider">
              Senha
            </label>
            <Input id="password" name="password" type="password" required />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Não foi possível entrar. Confira as credenciais.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full mt-2">
            Entrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

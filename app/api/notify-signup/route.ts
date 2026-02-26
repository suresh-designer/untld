import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const { email, firstName } = await req.json();

        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not set');
            return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'Untld <onboarding@resend.dev>',
            to: ['sureshdharun3@gmail.com'],
            subject: 'New User Signup - Untld',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #000; font-size: 24px;">New Signup! 🎉</h1>
                    <p style="color: #666; font-size: 16px;">
                        A new user has just joined <strong>Untld</strong>.
                    </p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #333;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0 0 0; color: #333;"><strong>Name:</strong> ${firstName || 'User'}</p>
                    </div>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        This is an automated notification from your app.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return new Response(JSON.stringify({ error }), { status: 400 });
        }

        return new Response(JSON.stringify({ data }), { status: 200 });
    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

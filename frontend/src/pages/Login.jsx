import {useState} from 'react';
import {useNav} from '../navigation';
import Img from '../components/Img';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {Card, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {ArrowRight, Loader2} from 'lucide-react';
import {useForm} from 'react-hook-form';

export default function Login() {
  const {navigate} = useNav();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError('');

    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('dashboard');
      } else {
        setServerError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setServerError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--bg-page)]">
      {/* ===== FORM PANEL ===== */}
      <div className="w-full md:flex-[0.46] flex flex-col justify-between p-6 sm:p-10 md:p-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-[var(--radius-md)] bg-[var(--brand-primary)] text-white flex items-center justify-center font-display font-bold">T</div>
          <span className="font-display text-xl font-bold tracking-tight text-[var(--brand-primary)]">Traveloop</span>
        </div>

        {/* Form */}
        <div className="max-w-sm w-full mx-auto md:mx-0">
          <Badge variant="secondary" className="mb-4">Sign in</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Welcome back.</h1>
          <p className="text-[var(--text-secondary)] mb-8">Pick up where you left off — your itineraries and notes are right where you left them.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-6 font-medium">{serverError}</div>}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="name@traveloop.io"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Password</Label>
                <a className="text-xs text-[var(--brand-primary)] hover:underline cursor-pointer" onClick={() => navigate('forgot-password')}>Forgot password?</a>
              </div>
              <Input
                type="password"
                {...register('password', {required: 'Password is required'})}
                placeholder="••••••••"
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer text-[var(--text-primary)]">
              <Checkbox id="remember" />
              Keep me signed in
            </label>

            <Button className="w-full h-11" type="submit" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight size={14} className="ml-2" /></>
              )}
            </Button>

            <div className="text-sm text-[var(--text-tertiary)] text-center pt-2">
              New here? <a className="text-[var(--text-primary)] underline cursor-pointer" onClick={() => navigate('register')}>Create an account</a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-xs text-[var(--text-tertiary)] flex justify-between">
          <span>© 2026 Traveloop</span><span>v1.4.0</span>
        </div>
      </div>

      {/* ===== IMAGE PANEL — hidden on mobile, visible md+ ===== */}
      <div className="hidden md:block flex-1 relative bg-[var(--bg-muted)]">
        <Img label="Lisbon · 38.72° N" className="absolute inset-0 rounded-none border-0 border-l h-full w-full" style={{ aspectRatio: undefined }} />
        <Card className="absolute bottom-10 left-10 right-10 max-w-md py-0">
          <CardHeader className="p-6">
            <Badge variant="accent" className="w-fit mb-2">Featured · 7 days</Badge>
            <CardTitle className="text-xl">The slow road through Iberia</CardTitle>
            <CardDescription>From Porto's wineries to Granada's old quarter — a hand-built itinerary.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

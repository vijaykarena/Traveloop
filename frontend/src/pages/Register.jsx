import Chrome from '../components/Chrome';
import {useNav} from '../navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {Textarea} from '@/components/ui/textarea';
import {ArrowRight, Plus, Loader2} from 'lucide-react';
import {useState} from 'react';
import {useForm} from 'react-hook-form';

export default function Register() {
  const {navigate} = useNav();
  const {
    watch,
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({defaultValues: {country: 'India', countryCode: '+91'}});

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const password = watch('password');

  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError('');

    try {
      const {confirmPassword, ...registerData} = formData;
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('dashboard');
      } else {
        setServerError(data.error || 'Registration failed');
      }
    } catch (err) {
      setServerError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="" />
      <div className="grid grid-cols-[1fr_1.4fr] flex-1 overflow-hidden">
        <div className="p-10 border-r flex flex-col justify-between overflow-auto bg-muted/30">
          <div>
            <Badge variant="secondary" className="mb-3">
              Join Traveloop
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight">Create your account.</h1>
            <p className="text-muted-foreground mt-3 max-w-sm text-base">A free account stores trips, notes, and packing lists across devices.</p>
          </div>
          <div className="py-8 border-y my-8">
            <Label className="mb-4 block text-base">Profile photo</Label>
            <div className="flex items-center gap-6">
              <div className="h-28 w-28 rounded-full border-2 border-dashed grid place-items-center text-muted-foreground bg-background hover:bg-muted transition-colors cursor-pointer">
                <Plus size={32} />
              </div>
              <div className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">Drop a square JPG or PNG, ≥ 400×400 px. (Optional)</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Already a member?{' '}
            <a className="text-primary font-medium hover:underline cursor-pointer" onClick={() => navigate('login')}>
              Sign in
            </a>
          </div>
        </div>

        <div className="p-10 overflow-auto bg-background">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl pb-10">
            <h2 className="text-2xl font-semibold mb-8 border-b pb-4">Personal details</h2>

            {serverError && <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-8 font-medium">{serverError}</div>}

            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input
                  {...register('firstName', {required: 'First name is required'})}
                  placeholder="Amelia"
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input
                  {...register('lastName', {required: 'Last name is required'})}
                  placeholder="Stone"
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {value: /^\S+@\S+$/i, message: 'Invalid email address'},
                  })}
                  placeholder="amelia.stone@traveloop.io"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register('password', {required: 'Password is required', minLength: {value: 6, message: 'Min 6 characters'}})}
                  placeholder="••••••••"
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <div className="grid grid-cols-[80px_1fr] gap-3 col-span-2">
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input {...register('countryCode', {required: true})} placeholder="+91" />
                </div>
                <div className="space-y-2">
                  <Label>Phone number</Label>
                  <Input
                    {...register('phoneNo', {required: 'Phone number is required'})}
                    placeholder="90909 09090"
                    className={errors.phoneNo ? 'border-destructive' : ''}
                  />
                  {errors.phoneNo && <p className="text-xs text-destructive">{errors.phoneNo.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  {...register('city', {required: 'City is required'})}
                  placeholder="Ahmedabad"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  {...register('country', {required: 'Country is required'})}
                  placeholder="India"
                  className={errors.country ? 'border-destructive' : ''}
                />
                {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
              </div>
            </div>

            <div className="space-y-2 mt-8">
              <Label>About you (Bio)</Label>
              <Textarea
                {...register('bio')}
                rows={4}
                placeholder="Slow travel through small towns. Coastal walks, family-run kitchens..."
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between mt-12 pt-8 border-t">
              <Badge variant="outline" className="px-3 py-1">
                Ready to explore
              </Badge>
              <div className="flex gap-4">
                <Button type="button" variant="ghost" onClick={() => navigate('login')}>
                  Cancel
                </Button>
                <Button type="submit" className="min-w-[140px]" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ContactProfile from '@/components/profile/ContactProfile';
import AuthProfile from '@/components/profile/AuthProfile';
import PreferencesProfile from '@/components/profile/PreferencesProfile';
import {
  AuthProfileProps,
  ContactProfileProps
} from '@/types/profile';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User } from '@prisma/client';
import { useTranslation } from '@/lib/i18n/LanguageContext';

type ProfileProps = {
  profile: User;
};

const Profile = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { status, update, data: session } = useSession();
  const { id } = params;
  const { t } = useTranslation();

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactProfile, setContactProfile] =
    useState<ContactProfileProps>({
      phone: ''
    });
  const [authProfile, setAuthProfile] = useState<AuthProfileProps>({
    username: '',
    email: ''
  });
  const [preferences, setPreferences] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: ProfileProps = await response.json();

        setContactProfile({
          phone: data.profile.phone || ''
        });
        setAuthProfile({
          username: data.profile.username,
          email: data.profile.email
        });

        try {
          const prefRes = await fetch('/api/preferences');
          if (prefRes.ok) {
            const prefData = await prefRes.json();
            setPreferences(prefData);
          }
        } catch {
          // preferences fetch failed silently
        }
      } else {
        setIsError(true);
        toast.error('An unexpected error occurred');
      }
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateContact = async (phone: string) => {
    setContactProfile({ phone });

    await update({
      ...session,
      user: {
        ...session?.user,
        phone
      }
    });
  };

  const handleUpdateAuth = async (username: string, email: string) => {
    setAuthProfile({ username, email });

    await update({
      ...session,
      user: {
        ...session?.user,
        username,
        email
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return router.push('/auth/login');
  }

  return (
    <div className="flex flex-grow flex-col pb-20">
      <h1 className="my-5 text-2xl font-bold">{t('nav.profile')}</h1>
      {!isError ? (
        <Tabs defaultValue="contact" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">{t('profile.contact')}</TabsTrigger>
            <TabsTrigger value="authentication">{t('profile.account')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('profile.preferences')}</TabsTrigger>
          </TabsList>
          <TabsContent value="contact">
            <ContactProfile
              id={id}
              contactProfile={contactProfile}
              handleUpdateContact={handleUpdateContact}
            />
          </TabsContent>
          <TabsContent value="authentication">
            <AuthProfile
              id={id}
              authProfile={authProfile}
              handleUpdateAuth={handleUpdateAuth}
            />
          </TabsContent>
          <TabsContent value="preferences">
            <PreferencesProfile preferences={preferences} />
          </TabsContent>
        </Tabs>
      ) : (
        <p className="m-auto text-lg">Something went wrong</p>
      )}
    </div>
  );
};

export default Profile;

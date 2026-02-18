// Define your email template component
import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  message
}) => {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>{message}</p>
    </div>
  );
};

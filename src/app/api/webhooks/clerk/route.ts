import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { backendClient } from '@/lib/backend-client';

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Check if user already exists with this email
      const email = email_addresses[0]?.email_address;
      if (!email) {
        return new Response('No email found', { status: 400 });
      }

      try {
        // Check if user exists with this email
        const checkEmailResponse = await backendClient.get('/api/register/check-email', {
          params: { email },
        });

        if (!checkEmailResponse.data.available) {
          // User exists - we'll handle unification later when they try to login
          // For now, create the user with Clerk ID and let them unify later
          console.log('User exists with email, will need to unify:', email);
        }

        // Create blank user in backend
        const userData: any = {
          clerkId: id,
          email,
          firstName: first_name || undefined,
          lastName: last_name || undefined,
          profilePicture: image_url || undefined,
          profileCompleted: false, // Will need to complete profile
        };

        const response = await backendClient.post('/api/register', userData);

        return new Response(
          JSON.stringify({ success: true, user: response.data.data }),
          { status: 200 }
        );
      } catch (error: any) {
        // If user exists, try to unify
        if (error.response?.status === 409 && error.response?.data?.existingUser) {
          // User exists - try to unify login methods
          try {
            const unifyResponse = await backendClient.post('/api/register/unify-login', {
              email,
              clerkId: id,
            });
            console.log('Login methods unified:', email);
            return new Response(
              JSON.stringify({ success: true, user: unifyResponse.data.data, unified: true }),
              { status: 200 }
            );
          } catch (unifyError: any) {
            console.error('Error unifying login methods:', unifyError);
            // Still return success - unification can happen on login
            return new Response(
              JSON.stringify({ success: true, message: 'User exists, unification needed' }),
              { status: 200 }
            );
          }
        }
        console.error('Error creating user in webhook:', error.response?.data || error.message);
        throw error;
      }
    } else if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0]?.email_address;

      if (!email) {
        return new Response('No email found', { status: 400 });
      }

      // Update user in backend (find by clerkId)
      try {
        // First, get user by clerkId from backend
        // Since we don't have a direct endpoint, we'll need to update via register/complete-profile
        // or create a new endpoint. For now, we'll use the complete-profile endpoint
        const updateData: any = {
          firstName: first_name || undefined,
          lastName: last_name || undefined,
          profilePicture: image_url || undefined,
        };

        // Note: This requires the user to be found by clerkId first
        // We might need to add a backend endpoint to get/update by clerkId
        console.log('User updated in Clerk:', id, updateData);
        
        return new Response(
          JSON.stringify({ success: true, message: 'User update logged' }),
          { status: 200 }
        );
      } catch (error) {
        console.error('Error updating user:', error);
        return new Response('Error updating user', { status: 500 });
      }
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      // Handle user deletion if needed
      console.log('User deleted in Clerk:', id);
      
      return new Response(
        JSON.stringify({ success: true, message: 'User deletion logged' }),
        { status: 200 }
      );
    }

    return new Response('', { status: 200 });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return new Response(
      JSON.stringify({ 
        error: 'Error processing webhook',
        message: error.message,
        details: error.response?.data 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}


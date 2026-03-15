import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We rely on StackAuth for authentication.
  // Stack Auth sets a cookie like `stack-cookie` or similar, 
  // but strictly, it provides `stackServerApp.getUser()` for server contexts.
  
  // GUARDIAN: If a user has a session active in the browser, prevent them 
  // from accessing the /handler/sign-in or /handler/sign-up screens. 
  // This intercepts it *before* Stack Auth runs, preventing infinite loops.
  const isAuthPage = request.nextUrl.pathname.startsWith('/handler/sign-in') || 
                     request.nextUrl.pathname.startsWith('/handler/sign-up');
                     
  const stackToken = request.cookies.get('stack-cookie') || 
                     request.cookies.get('__Secure-stack-token'); // Check common auth cookies

  if (isAuthPage && stackToken) {
     // If they are logged in and try to hit signin, send them to the safe auth-callback
     // which will correctly resolve their role and push them to the right dashboard.
     return NextResponse.redirect(new URL('/auth-callback', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/mentor/:path*', '/admin/:path*'],
};

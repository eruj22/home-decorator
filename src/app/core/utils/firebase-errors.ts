const FIREBASE_ERROR_CODES: { [key: string]: string } = {
  'auth/user-not-found': 'No user found with the provided email.',
  'auth/wrong-password': 'The password is incorrect. Please try again.',
  'auth/invalid-email': 'The email address is not valid.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/too-many-requests':
    'Too many unsuccessful login attempts. Please try again later.',
  'auth/invalid-credential': 'The provided email or password is invalid.',
  'auth/email-already-in-use':
    'The email address is already in use by another account.',
  'auth/operation-not-allowed':
    'Email/password accounts are not enabled. Please contact support.',
  'auth/weak-password':
    'The password is too weak. Please choose a stronger one.',
};

export const getFirebaseErrorMessage = (
  errorMessage?: string
): string | null => {
  const matchErrorKey = errorMessage?.match(/(?<=\().+?(?=\))/);
  if (!matchErrorKey?.[0]) {
    return null;
  }

  return FIREBASE_ERROR_CODES[matchErrorKey[0]] ?? null;
};

import type { ReactElement } from 'react';

export const PasswordTips = (): ReactElement => (
  <>
    <p><strong>Never give out your password to anyone.</strong> Don't give your password out to anyone. QC Career School will never ask you for your password.</p>
    <p><strong>Don&apos;t just use one password.</strong> Use a different password for each website. If your password for one website is compromised, your accounts on other websites will remain safe.</p>
    <p><strong>Make complex passwords.</strong> Use a combination of uppercase letters, lowercase letters, numbers, and symbols in your password. E.g., <span className="font-monospace">T4^pB4%6SYNNI+m</span></p>
    <p><strong>Make the password at least 12 characters long.</strong> The longer the better. Longer passwords are harder for thieves to crack.</p>
    <p><strong>Consider using a password manager.</strong> Web browsers such as Chrome, Firefox, Safari, or Edge can remember your passwords for you. Then you won't have to remember all your long, complex, and unique passwords.</p>
  </>
);

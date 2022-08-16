import type { FC } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

export const AccountIcon: FC = () => (
  <>
    <a href="/students/accounts/view.php"><div id="accountImage" className="me-md-3" /></a>
    <small className="d-none d-md-inline me-2">LOGOUT</small>
    <a href="/students/logout.php" className="d-none d-md-inline"><FaSignOutAlt /></a>

    <style jsx>{`
      a:link, a:visited { color: #b70404 }
      a:hover, a:active { color: #e10019 }
      #accountImage {
        display:inline-block;
        vertical-align:middle;
        width:56px;
        height:56px;
        border-radius:28px;
        background:url('/students/portraits/view.php?thumbnail=64&amp;v=1590199169');
        background-size:cover;
      }
    `}</style>
  </>
);

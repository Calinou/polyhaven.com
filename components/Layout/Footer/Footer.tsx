import Link from 'next/link';

import Button from 'components/Button/Button'
import SocialIcons from 'components/SocialIcons/SocialIcons'
import CorporateSponsors from 'components/CorporateSponsors/CorporateSponsors'
import PatronList from './PatronList'

import styles from './Footer.module.scss';

const footer = () => {
  return (
    <div id={styles.footer}>
      <h2>Patrons</h2>
      <div className={styles.patrons}>
        <div className={styles.patronsScrollWrapper}>
          <div className={styles.patronsScroll}>
            <div className={styles.patronsSetA}>
              <PatronList />
            </div>
          </div>
        </div>
      </div>
      <CorporateSponsors footer={true} />
      <Button text="Join the ranks, support Poly Haven on Patreon" href="https://www.patreon.com/hdrihaven/overview" />
      <div className={styles.linksWrapper}>
        <a id="social" />
        <div className={styles.links}>
          <Link href="/"><a>
            <div className={styles.logoWrapper}>
              <img src='/Logo 256.png' className={styles.logo} />
              <h1>Poly Haven</h1>
              <p>The Public Asset Library</p>
            </div>
          </a></Link>
          <div className={styles.linkListWrapper}>
            <div className={styles.linkList}>
              <Link href="/"><a>Home</a></Link>
              <Link href="/all"><a>Assets</a></Link>
              <Link href="/faq"><a>FAQ</a></Link>
              <Link href="/about-contact"><a>About / Contact</a></Link>
            </div>
          </div>
          <div className={styles.linkListWrapper}>
            <div className={styles.linkList}>
              <Link href="/license"><a>License</a></Link>
              <Link href="/privacy"><a>Privacy</a></Link>
              <Link href="/finance-reports"><a>Finance Reports</a></Link>
              <Link href="/map"><a>Map</a></Link>
            </div>
          </div>
          <div className={styles.linkListWrapper}>
            <div className={styles.linkList}>
              <Link href="https://blog.hdrihaven.com"><a>Blog</a></Link>
              <Link href="/contribute"><a>Contribute</a></Link>
              <Link href="https://github.com/Poly-Haven/Public-API"><a>API</a></Link>
              <Link href="https://github.com/Poly-Haven/polyhaven.com"><a>Source</a></Link>
            </div>
          </div>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
}

export default footer;
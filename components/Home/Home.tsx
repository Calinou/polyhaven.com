import Link from 'next/link';

import Slider from './Slider/Slider'
import Heart from 'components/Heart/Heart'
import Button from 'components/Button/Button'
import Patron from 'components/Avatar/Patron'
import ProgressBar from 'components/ProgressBar/ProgressBar'
import Todo from 'components/Todo/Todo'
import SocialIcons from 'components/SocialIcons/SocialIcons'
import CorporateSponsors from 'components/CorporateSponsors/CorporateSponsors'

import styles from './Home.module.scss'

const Home = ({ patreonGoal, patreonProgress }) => {
  const exampleNames = [
    "Joni Mercado",
    "S J Bennett",
    "Adam Nordgren",
    "RENDER WORX",
    "Pierre Beranger",
    "Pablo Lopez Soriano",
    "Frank Busch",
    "Sterling Roth",
    "Jonathan Sargent",
    "hector gil",
    "Philip bazel",
    "Llynara",
    "BlenderBrit",
    "william norberg",
    "Michael Szalapski",
    "Joni Mercado",
    "S J Bennett",
    "Adam Nordgren",
    "RENDER WORX",
    "Pierre Beranger",
    "Pablo Lopez Soriano",
    "Frank Busch",
    "Sterling Roth",
    "Jonathan Sargent",
    "hector gil",
    "Philip bazel",
    "Llynara",
    "BlenderBrit",
    "william norberg",
    "Michael Szalapski",
  ]

  let newestPatrons = {};
  for (const p of exampleNames) {
    newestPatrons[p] = {
      image: `https://picsum.photos/seed/${p}/36`,
      age: 1620830938000
    }
  }

  return (
    <div className={styles.home}>

      <Slider />

      <div className={styles.sectionWrapper}>
        <div className={styles.assetTypeBanner}>
          <div className={`${styles.subSection} ${styles.subSectionHDRI}`}>
            <div className={styles.assetTypeBannerHover} />
            <div className={styles.text}>
              <img src="/icons/type_H.svg" className={styles.assetTypeImage} />
              <h2>HDRIs</h2>
              <p>16k+ resolution, and always unclipped for one-click realistic lighting.</p>
              <Button text="Browse HDRIs" href="/hdris" color='blue' />
            </div>
          </div>
          <div className={`${styles.subSection} ${styles.subSectionTex}`}>
            <div className={styles.assetTypeBannerHover} />
            <div className={styles.text}>
              <img src="/icons/type_T.svg" className={styles.assetTypeImage} />
              <h2>Textures</h2>
              <p>Photoscanned seamless PBR materials, at least 8k resolution.</p>
              <Button text="Browse Textures" href="/textures" color='orange' />
            </div>
          </div>
          <div className={`${styles.subSection} ${styles.subSectionMod}`}>
            <div className={styles.assetTypeBannerHover} />
            <div className={styles.text}>
              <img src="/icons/type_M.svg" className={styles.assetTypeImage} />
              <h2>Models</h2>
              <p>Hyperreal 3D models, for visual effects and next-gen video games.</p>
              <Button text="Browse Models" href="/models" color='green' />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.subSection}>
            <div className={styles.text}>
              <h2>100% Free</h2>
              <p>Not just free, but <Link href="/license">CC0</Link>, meaning you can use them for absolutely any purpose <strong>without restrictions</strong>.</p>
              <p>No paywalls or signup required, simply download what you want and use it immediately without worry.</p>
            </div>
          </div>
          <div className={styles.subSection}>
            <Todo />
          </div>
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.subSection}>
            <Todo />
          </div>
          <div className={styles.subSection}>
            <div className={styles.text}>
              <h2>High quality</h2>
              <p>"Free" and "quality" don't always have to be mutually exclusive.</p>
              <p>We don't want to pollute the web with more trash, so we focus on creating the best <strong>assets that you can actually use</strong>.</p>
              <p>Our target is to create content that will not just hold up to today's standards, but higher future standards, and the potential of future hardware too.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.subSection}>
            <h2>Supported by you <Heart color="#F96854" /></h2>
            <ProgressBar progress={patreonProgress} label="Current goal" labelValue={patreonGoal} />
            <Button text="Become a Patron" href="https://polyhaven.com/support-us" />
            <Button text="Finance Reports" href="/finance-reports" color='hollow' />
          </div>
          <div className={styles.subSection}>
            <div className={styles.textLeft}>
              <p>As a 3D artist yourself, you know how much work it is to create good assets, especially when other people will need to use them for a variety of projects.</p>
              <p>The computers and camera equipment necessary to produce high quality content are expensive, and so is the web infrastructure needed to keep this platform running.</p>
              <p>This is where you come in.</p>
              <p>With your support, not only can we keep Poly Haven alive and running, but <strong>we can improve it</strong>.</p>
            </div>
          </div>
        </div>
        <div className={styles.newestPatrons}>
          <h4>Newest Patrons:</h4>
          {Object.keys(newestPatrons).map(n => <Patron name={n} image={newestPatrons[n].image} size={36} timestamp={newestPatrons[n].age} />)}
          <div className={styles.fade} />
        </div>
        <CorporateSponsors />
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <Button text="Browse Assets" href="/assets" />
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.subSection}>
            <div className={styles.text}>
              <h2 style={{ textAlign: 'center' }}>About Us</h2>
              <p>Poly Haven is a small company located in South Africa, working with artists around the world.</p>
              <p>Our goal is to create a constantly growing community-funded resource of open content, for complete freedom and usability by professionals and hobbyists alike. </p>
              <p>Previously we ran <span className='text-blue'>HDRI Haven</span>, <span className='text-orange'>Texture Haven</span> and <span className='text-green'>3D Model Haven</span> as separate independant projects, but ultimately decided we could serve the community better by joining forces and creating a single new platform: <span className='text-accent'>Poly Haven</span>.</p>
              <p>If you like what we do and want to keep this site alive, consider <a href="https://polyhaven.com/support-us">supporting us on Patreon</a>.</p>
            </div>
          </div>
          <div className={styles.subSection}>
            <Todo>Avatars</Todo>
          </div>
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.subSection}>
            <h2>User Renders</h2>
            <Todo />
          </div>
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.subSection}>
            <h2>Join the Community</h2>
            <p>Poly Haven is <strong>your</strong> community project.</p>
            <p>Everything we do, we do with your help, for the greater 3D community.</p>
          </div>
          <div className={styles.subSection}>
            <SocialIcons />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

import React, { useState, useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0';
import dynamic from 'next/dynamic'
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import { timeago } from 'utils/dateUtils';

import asset_types from 'constants/asset_types.json'
import asset_type_names from 'constants/asset_type_names.json'
import { getPatronInfo } from 'utils/patronInfo';

import { MdFileDownload, MdLastPage } from "react-icons/md";

import Page from 'components/Layout/Page/Page'
import DisplayAd from 'components/Ads/DisplayAd';
import AuthorCredit from 'components/AuthorCredit/AuthorCredit'
import Spinner from 'components/Spinner/Spinner'
import Heart from 'components/Heart/Heart'
import IconButton from "components/UI/Button/IconButton";
import AssetDlGraph from "components/Stats/AssetDlGraph";
import Carousel from './Carousel/Carousel'
import Download from './Download/Download'
import Similar from './Similar/Similar'
import UserRenders from './UserRenders';
import InfoItem from './InfoItem'
import Sponsor from './Sponsor'
import GLTFViewer from './WebGL/GLTFViewer'

import styles from './AssetPage.module.scss'
import ErrorBoundary from 'utils/ErrorBoundary';

const PanoViewer = dynamic(
  () => import('./WebGL/PanoViewer'),
  { ssr: false }
)

const AssetPage = ({ assetID, data, scrollPosition }) => {
  const { user, isLoading: userIsLoading } = useUser();
  const [uuid, setUuid] = useState(null);
  const [patron, setPatron] = useState({});
  const [pageLoading, setPageLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [showWebGL, setShowWebGL] = useState(false)
  const [hideSidebar, setHideSidebar] = useState(true);

  const authors = Object.keys(data.authors).sort()
  const multiAuthor = authors.length > 1;

  const msPerDay = 24 * 60 * 60 * 1000
  const monthAgo = new Date(Date.now() - (30 * msPerDay)).toISOString().split('T')[0]
  const isOlderThanFourDays = (Date.now() - data.date_published * 1000) > (4 * msPerDay)

  const toggleSidebar = () => {
    setHideSidebar(!hideSidebar)
  }

  useEffect(() => {  // Page changes
    document.getElementById('header-title').innerHTML = data.name
    let path = document.getElementById('header-frompath').innerHTML
    if (!path) {
      path = `<a href="/${Object.keys(asset_types)[data.type]}">${asset_type_names[data.type]}s</a> /`
    }
    document.getElementById('header-path').innerHTML = path
    document.getElementById('header-frompath').innerHTML = ""
    document.getElementById('page').scrollTop = 0

    return (() => {
      document.getElementById('header-path').innerHTML = ""
      document.getElementById('header-title').innerHTML = ""
    })
  }, [assetID]);

  useEffect(() => {  // Handle user loading
    if (uuid) {
      getPatronInfo(uuid)
        .then(resdata => {
          setPatron(resdata)
        })
    } else {
      if (user) {
        setUuid(user.sub.split('|').pop())
      }
    }
  }, [user, uuid]);

  const clickSimilar = () => {
    setPageLoading(true)
    setShowWebGL(false)
  }

  const setPreviewImage = (src) => {
    setImageLoading(true)
    if (src.startsWith("https://cdn.polyhaven.com/")) {
      src += "?height=780"
    }
    document.getElementById('activePreview').setAttribute('src', src);
  }
  const imageLoaded = (e) => {
    setImageLoading(false)
    setPageLoading(false)
    setShowWebGL(false)
  }

  const clickShowWebGL = _ => {
    setShowWebGL(true)
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.loading} ${!pageLoading ? styles.hidden : null}`}>
        <Spinner />
      </div>
      <Page immersiveScroll assetPage>
        <div className={styles.mobileHeader}>
          <h1>{data.name}</h1>
          <div className={`${styles.sidebarToggle} ${!hideSidebar ? styles.sidebarToggleClose : ''}`}>
            <IconButton icon={hideSidebar ? <MdFileDownload /> : <MdLastPage />} onClick={toggleSidebar} />
          </div>
        </div>

        <div className={styles.previewWrapper}>
          <div className={`${styles.activePreview}${showWebGL ? " " + styles.activePreviewGLTF : ""}`}>
            <img
              id="activePreview"
              onLoad={imageLoaded}
              src={`https://cdn.polyhaven.com/asset_img/primary/${assetID}.png?height=780`}
            />
            {data.type === 0 ?
              (showWebGL ? <PanoViewer assetID={assetID} /> : null)
              :
              <ErrorBoundary>
                <GLTFViewer show={showWebGL} assetID={assetID} />
              </ErrorBoundary>
            }
            <div className={`${styles.loading} ${!imageLoading ? styles.hidden : null}`}>
              <Spinner />
            </div>
          </div>
          <div className={styles.carousel}>
            <Carousel slug={assetID} assetType={data.type} setter={setPreviewImage} showWebGL={clickShowWebGL} />
          </div>
        </div>
        <div className={styles.similar}>
          <h2>Similar Assets</h2>
          <Similar slug={assetID} scrollPosition={scrollPosition} onClick={clickSimilar} />
        </div>
        <UserRenders assetID={assetID} />
      </Page>

      <div className={`${styles.sidebar} ${hideSidebar ? styles.hiddenMobile : ''}`}>

        <div className={styles.info}>

          <Download
            assetID={assetID}
            data={data}
            setPreview={setPreviewImage}
            patron={patron}
          />

          <div className={styles.infoItems}>

            <InfoItem label={`${multiAuthor ? "Authors" : "Author"}`} flex>
              <div className={styles.authors}>
                {authors.map(a => <AuthorCredit id={a} key={a} credit={multiAuthor ? data.authors[a] : ""} />)}
              </div>
              {data.donated ? <div className={styles.heart} title="This asset was donated to Poly Haven freely by the author :)"><Heart /></div> : null}
            </InfoItem>

            {data.info ? <div>
              <div className={styles.infoText} lang="en">
                <Markdown>{data.info.replace(/\\n/g, '\n')}</Markdown>
              </div>
            </div> : null}

            <InfoItem label="License">
              <Link href="/license">CC0</Link> (public domain)
            </InfoItem>
            <InfoItem label="Published">
              <span title={new Date(data.date_published * 1000).toLocaleString("en-ZA")}>
                {timeago(data.date_published * 1000)}
              </span>
            </InfoItem>
            <InfoItem label="Dynamic Range" condition={Boolean(data.evs_cap)}>
              {data.evs_cap} <Link href="/faq#stops">EVs</Link>, unclipped
            </InfoItem>
            <InfoItem label="Scale" condition={Boolean(data.scale)}>
              {data.scale}
            </InfoItem>
            {/* Hiding this for now as the info is always in the wrong timezone. */}
            {/* <InfoItem label="Captured" condition={Boolean(data.date_taken)}>
              {new Date(data.date_taken * 1000).toLocaleString("en-ZA")}
            </InfoItem> */}
            <InfoItem label="Location" condition={Boolean(data.coords)}>
              {data.coords ? data.coords.join(', ') : null}
            </InfoItem>
            <InfoItem label="Whitebalance" condition={Boolean(data.whitebalance)}>
              {data.whitebalance}K
            </InfoItem>
            <InfoItem label="Downloads" condition={Boolean(data.download_count)} flex>
              {data.download_count}
              {isOlderThanFourDays ? <AssetDlGraph slug={assetID} dateFrom={monthAgo} /> : null}
            </InfoItem>

            <div className={styles.spacer} />
            <Sponsor assetID={assetID} sponsors={data.sponsors} patron={patron} />
            <div className={styles.spacer} />

            <InfoItem label="Categories">
              <div className={styles.tagsList}>
                {data.categories.map(i =>
                  <Link href={`/${Object.keys(asset_types)[data.type]}/${i}`} key={i}><a>
                    <div className={styles.tag}>{i}</div>
                  </a></Link>
                )}
              </div>
            </InfoItem>
            <InfoItem label="Tags">
              <div className={styles.tagsList}>
                {data.tags.map(i =>
                  <Link href={`/${Object.keys(asset_types)[data.type]}?s=${i}`} key={i}><a>
                    <div className={styles.tag}>{i}</div>
                  </a></Link>
                )}
              </div>
            </InfoItem>
          </div>
        </div>

        <div className={styles.sidebarAd}><DisplayAd id="9249051205" x={336} y={280} showRemoveBtn /></div>
      </div>
    </div>
  )
}

export default trackWindowScroll(AssetPage)

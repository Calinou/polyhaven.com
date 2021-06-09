import { useState } from 'react'
import { useEffect } from "react";
import Link from 'next/link';
import { trackWindowScroll } from 'react-lazy-load-image-component';

import asset_types from 'constants/asset_types.json'
import asset_type_names from 'constants/asset_type_names.json'

import Page from 'components/Layout/Page/Page'
import AdAssetSidebar from 'components/Ads/AssetSidebar'
import AuthorCredit from 'components/AuthorCredit/AuthorCredit'
import Spinner from 'components/Spinner/Spinner'
import Carousel from './Carousel/Carousel'
import Download from './Download/Download'
import Similar from './Similar/Similar'
import InfoItem from './InfoItem'
import Sponsor from './Sponsor'

import styles from './AssetPage.module.scss'

const AssetPage = ({ assetID, data, scrollPosition }) => {
  const [pageLoading, setPageLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const authors = Object.keys(data.authors)
  const multiAuthor = authors.length > 1;

  useEffect(() => {
    document.getElementById('header-title').innerHTML = data.name
    let path = document.getElementById('header-frompath').innerHTML
    if (!path) {
      path = `<a href="/${Object.keys(asset_types)[data.type]}">${asset_type_names[data.type]}s</a> /`
    }
    document.getElementById('header-path').innerHTML = path
    document.getElementById('header-frompath').innerHTML = ""
  });

  const clickSimilar = () => {
    document.getElementById('page').scrollTop = 0
    setPageLoading(true)
  }

  const setPreviewImage = (src) => {
    setImageLoading(true)
    document.getElementById('activePreview').setAttribute('src', src + "?height=780");
  }
  const imageLoaded = (e) => {
    setImageLoading(false)
    setPageLoading(false)
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.loading} ${!pageLoading ? styles.hidden : null}`}>
        <Spinner />
      </div>
      <Page immersiveScroll={true}>
        <div className={styles.previewWrapper}>
          <div className={styles.activePreview}>
            <img
              id="activePreview"
              onLoad={imageLoaded}
              src={`https://cdn.polyhaven.com/asset_img/primary/${assetID}.png?height=780`}
            />
            <div className={`${styles.loading} ${!imageLoading ? styles.hidden : null}`}>
              <Spinner />
            </div>
          </div>
          <div className={styles.carousel}>
            <Carousel slug={assetID} setter={setPreviewImage} />
          </div>
        </div>
        <div className={styles.similar}>
          <h2>Similar Assets:</h2>
          <Similar slug={assetID} scrollPosition={scrollPosition} onClick={clickSimilar} />
        </div>
      </Page>

      <div className={styles.sidebar}>

        <div className={styles.info}>

          <Download assetID={assetID} data={data} />

          <InfoItem label="Author" flex>
            <div className={styles.authors}>
              {authors.map(a => <AuthorCredit id={a} key={a} credit={multiAuthor ? data.authors[a] : ""} />)}
            </div>
          </InfoItem>
          <InfoItem label="License">
            <Link href="/license">CC0</Link> (public domain)
          </InfoItem>
          <InfoItem label="Published">
            {new Date(data.date_published * 1000).toLocaleDateString("en-ZA")}
          </InfoItem>
          <InfoItem label="Dynamic Range" condition={data.evs_cap !== undefined}>
            {data.evs_cap} <Link href="/faq#stops">EVs</Link>, unclipped
          </InfoItem>
          <InfoItem label="Scale" condition={data.scale !== undefined}>
            {data.scale}
          </InfoItem>
          <InfoItem label="Captured" condition={data.date_taken !== undefined}>
            {new Date(data.date_taken * 1000).toLocaleString("en-ZA")}
          </InfoItem>
          <InfoItem label="Location" condition={data.coords !== undefined}>
            {data.coords ? data.coords.join(', ') : null}
          </InfoItem>
          <InfoItem label="Whitebalance" condition={data.whitebalance !== undefined}>
            {data.whitebalance}K
          </InfoItem>
          <InfoItem label="Downloads">
            {data.download_count}
          </InfoItem>

          <div className={styles.spacer} />
          <Sponsor assetID={assetID} sponsors={data.sponsors} />
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

        <div className={styles.sidebarAd}><AdAssetSidebar /></div>
      </div>
    </div>
  )
}

export default trackWindowScroll(AssetPage)

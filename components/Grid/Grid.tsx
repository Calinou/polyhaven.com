import Fuse from 'fuse.js';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import { MdSearch, MdClose } from 'react-icons/md'
import { MdWhatshot, MdEvent, MdStar, MdSortByAlpha } from 'react-icons/md'

import { weightedDownloadsPerDay } from 'utils/dateUtils'
import { titleCase } from 'utils/stringUtils'
import { assetTypeName } from 'utils/assetTypeName'
import apiSWR from 'utils/apiSWR'

import GridItem from './GridItem/GridItem'
import Spinner from 'components/Spinner/Spinner';
import DisplayAd from 'components/Ads/DisplayAd';
import Dropdown from 'components/UI/Dropdown/Dropdown'
import Disabled from 'components/UI/Disabled/Disabled'

import styles from './Grid.module.scss';

const Grid = (props) => {
  const sortBy = {
    hot: (d: Object) => {
      return Object.keys(d).sort(function (a, b) {
        return (weightedDownloadsPerDay(d[b].download_count, d[b].date_published) - weightedDownloadsPerDay(d[a].download_count, d[a].date_published));
      })
    },
    latest: (d: Object) => {
      return Object.keys(d).sort(function (a, b) {
        return (d[b].date_published - d[a].date_published);
      })
    },
    top: (d: Object) => {
      return Object.keys(d).sort(function (a, b) {
        return (d[b].download_count - d[a].download_count);
      })
    },
    name: (d: Object) => {
      return Object.keys(d).sort((a, b) => d[a].name.localeCompare(d[b].name))
    },
  }

  const setSort = selectedOption => {
    props.setSort(selectedOption)
  };
  const setSearch = event => {
    props.setSearch(event.target.value);
  }
  const submitSearch = event => {
    event.preventDefault();
  }
  const resetSearch = () => {
    props.setSearch("");
  }

  const asset_type_name = assetTypeName(props.assetType)

  const setHeaderPath = () => {
    let path = ''
    let link = ''
    if (props.assetType !== 'all') {
      link += `/${props.assetType}`
      path += `<a href=${encodeURI(link)}>${asset_type_name}</a> /`
    }
    for (const c of props.categories) {
      link += `/${c}`
      path += ` <a href=${encodeURI(link)}>${c}</a> /`
    }
    document.getElementById('header-frompath').innerHTML = path.trim()
  }

  let url = `/assets?t=${props.assetType}`
  if (props.categories.length) {
    url += "&c=" + props.categories.join(',')
  }
  const { data, error } = apiSWR(url, { revalidateOnFocus: false });
  if (error) return <div>Error</div>
  if (!data) return <div><Spinner /></div>

  let sortedKeys = sortBy[props.sort](data);

  if (props.search) {
    const fuse = new Fuse(Object.values(data), {
      keys: ['categories', 'tags', 'name'],
      includeScore: true,
      threshold: 0.2
    })
    const searchResults = fuse.search(props.search);
    const filteredData = {};
    for (const sr of searchResults) {
      let srID = Object.keys(data)[sr.refIndex];
      filteredData[srID] = data[srID];
    }
    sortedKeys = Object.keys(filteredData)
  }

  if (props.author) {
    sortedKeys = sortedKeys.filter(k => Object.keys(data[k].authors).includes(props.author));
  }

  let title = assetTypeName(props.assetType);
  if (props.categories.length) {
    title = asset_type_name + ": " + titleCase(props.categories.join(' > '))
  } else if (props.assetType !== "all") {
    title = "All " + title;
  }
  if (props.author) {
    title += ` (by ${props.author})`;
  }
  const fSize = Math.floor(title.length / 17.5);  // Rough detection of line length used to reduce font size.

  const sortOptions = {
    hot: {
      label: "Hot",
      tooltip: "Downloads per day, with newer assets weighted slightly higher.",
      icon: <MdWhatshot />
    },
    latest: {
      label: "Latest",
      tooltip: "Most recently published.",
      icon: <MdEvent />
    },
    top: {
      label: "Top",
      tooltip: "Total download count of all time.",
      icon: <MdStar />
    },
    name: {
      label: "Name",
      tooltip: "Sorted alphabetically.",
      icon: <MdSortByAlpha />
    }
  }

  return (
    <>
      <div className={styles.optionsBar}>
        <div className={styles.gridHeader}>
          <h1 className={styles['s' + fSize]}>{title}</h1>
          <div className={styles.options}>
            <div className={styles.menuSelection}>
              <Disabled
                disabled={Boolean(props.search)}
                tooltip="Sorting by search relevance."
                tooltipSide={"bottom"}
              >
                <Dropdown
                  value={props.sort}
                  options={sortOptions}
                  label="Sort by"
                  onChange={setSort}
                />
              </Disabled>
            </div>
            <div className={styles.search}>
              <MdSearch className={styles.searchIcon} />
              <form onSubmit={submitSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={props.search}
                  onChange={setSearch} />
              </form>
              {props.search ?
                <MdClose className={styles.resetSearchIcon} onClick={resetSearch} />
                : null}
            </div>
            {<p className={styles.numResults}>{sortedKeys.length} results</p>}
          </div>
        </div>
        <div className={styles.adGridTop}>
          <DisplayAd id="9488083725" x={468} y={60} />
        </div>
      </div>

      {sortedKeys.length ?
        <div className={styles.grid}>
          {sortedKeys.map(asset => {
            return (<GridItem
              key={asset}
              asset={data[asset]}
              assetID={asset}
              onClick={setHeaderPath}
              scrollPosition={props.scrollPosition} />);
          })}
        </div>
        :
        <div className={styles.noResults}>
          <h2>No results :(</h2>
          {props.search ? <p>Try using a different keyword</p> : null}
        </div>
      }
    </>
  );
}

export default trackWindowScroll(Grid);
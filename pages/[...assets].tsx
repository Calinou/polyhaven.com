import Head from 'next/head';

import Library from 'containers/Library/Library'

import typesAvailable from 'constants/asset_types.json';
import { assetTypeName } from 'utils/assetTypeName'
import { titleCase } from 'utils/stringUtils'

const LibraryPage = (props) => {
  let title = assetTypeName(props.assetType)
  if (props.categories.length) {
    title += ": " + titleCase(props.categories.join(' > '))
  }
  title += " • Poly Haven"

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Library
        assetType={props.assetType}
        categories={props.categories}
        author={props.author}
        search={props.search}
        sort={props.sort}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  const params = context.params.assets
  const assetType = params.shift()
  const author = context.query.a
  const search = context.query.s
  let sort = context.query.o

  if (typesAvailable[assetType] === undefined) {
    return {
      notFound: true,
    }
  }

  const allowedSorts = [
    "hot",
    "latest",
    "top",
    "name"
  ]
  if (!allowedSorts.includes(sort)) {
    sort = "hot";
  }

  return {
    props: {
      assetType: assetType,
      categories: params,
      author: author ? author : "",
      search: search ? search : "",
      sort: sort ? sort : "hot"
    }
  }
}

export default LibraryPage;
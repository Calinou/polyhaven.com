import Head from 'components/Head/Head'

import { assetTypeName } from 'utils/assetTypeName'

import AssetPage from 'components/AssetPage/AssetPage'
import ErrorPage from 'components/Layout/Page/CenteredPage'

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.ok);
  }
  return response;
}

const Page = ({ assetID, data }) => {
  const pageUrl = `/a/${assetID}`
  if (!data) {
    return (
      <ErrorPage>
        <Head title="Error: 404" url={pageUrl} />
        <h1>404</h1>
        <p>No asset with id: "{assetID}"</p>
      </ErrorPage>
    )
  }
  return (
    <div className="content">
      <Head
        title={`${data.name} ${assetTypeName(data.type, false)}`}
        description={`Download this free ${assetTypeName(data.type, false)} from Poly Haven`}
        url={pageUrl}
        assetType={data.type}
        author={Object.keys(data.authors).join(', ')}
        keywords={`${data.categories.join(',')},${data.tags.join(',')}`}
        image={`https://cdn.polyhaven.com/asset_img/thumbs/${assetID}.png?width=630`}
      />
      <div>
        <AssetPage assetID={assetID} data={data} />
      </div>
    </div>
  )
}

export async function getStaticProps(context) {
  const id = context.params.id
  const baseUrl = (process.env.NODE_ENV == "production" || process.env.POLYHAVEN_API == "live") ? "https://api.polyhaven.com" : "http://localhost:3000"

  let error = null
  const data = await fetch(`${baseUrl}/info/${id}`)
    .then(handleErrors)
    .then(response => response.json())
    .catch(e => error = e)

  if (error) {
    return {
      props: {
        assetID: id
      },
      revalidate: 60 * 5 // 5 minutes
    }
  }

  return {
    props: {
      assetID: id,
      data: data
    },
    revalidate: 60 * 30 // 30 minutes
  }
}

export async function getStaticPaths() {
  const baseUrl = (process.env.NODE_ENV == "production" || process.env.POLYHAVEN_API == "live") ? "https://api.polyhaven.com" : "http://localhost:3000"
  const data = await fetch(`${baseUrl}/assets`)
    .then(handleErrors)
    .then(response => response.json())
    .catch(e => console.log(e));

  const paths = Object.keys(data).map((a) => ({ params: { id: a } }));

  return {
    paths,
    fallback: 'blocking'
  };
}


export default Page

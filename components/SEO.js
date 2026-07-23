import Head from "next/head";

const SITE_NAME = "TryonAI Admin";

export function PageHead({ title, description, noindex, children }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME}`;
  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {children}
    </Head>
  );
}

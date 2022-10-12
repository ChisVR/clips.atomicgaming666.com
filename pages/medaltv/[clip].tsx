import { NextPage, NextPageContext } from "next";
import { fetcher, host } from "../../lib/fetcher";
import { Clip } from "../../interfaces/clips";
import ErrorPage from "../_error";
import styled from "styled-components";
import { timeSince } from "../../lib/timeSince";
import { ClipsBody, Heading } from "../../components/clips";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from 'next/router';

interface Props {
  id?: string;
  clip?: Clip;
  error?: string;
}

const ClipPage: NextPage<Props> = ({ id, clip, error }) => {
  const router = useRouter();
  if (error) return <ErrorPage err={error} statusCode={500} />;

  return (
    <ClipsBody>
      <Head>
        <title>
          {clip.contentTitle} - Ballistic's MedalTV Clips
        </title>
        <meta name="twitter:card" content="player" />
        <meta name="twitter:title" content={clip.contentTitle} />
        <meta name="twitter:site" content="@BallisticOK">
        <meta name="twitter:image" content={clip.contentThumbnail} />
        <meta name="twitter:url" content={`${host}/medaltv/${id}`} />
        <meta name="twitter:player" content={clip.directClipUrl} />
        <meta name="twitter:player:width" content="620" />
        <meta name="twitter:player:height" content="378" />

        <meta property="og:title" content={clip.contentTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={clip.contentThumbnail} />
        
        <meta property="og:type" content="video.other" />
        <meta property="og:video" content={clip.directClipUrl} />
        <meta property="og:video:url" content={clip.directClipUrl} />
        <meta property="og:video:secure_url" content={clip.directClipUrl} />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="620" />
        <meta property="og:video:height" content="378" />
        
        <meta
          property="og:site_name"
          content="BallisticOK - Streamer / Developer / Content Creator"
        />
        <meta property="og:description" content={clip.contentTitle} />

        <meta itemProp="name" content={clip.contentTitle} />
        <meta itemProp="description" content={clip.contentTitle} />
        <meta itemProp="image" content={clip.contentThumbnail} />
      </Head>
      <Heading>
        <h1>
          <Link href="/">
            <a>⬅</a>
          </Link>
          {clip.contentTitle}
        </h1>
        <p>Published: {timeSince(clip.createdTimestamp * 1000)}</p>
      </Heading>
      <VideoContainer>
        <VideoPlayer src={clip.directClipUrl} />
      </VideoContainer>
    </ClipsBody>
  );
};

ClipPage.getInitialProps = async ({ query }: NextPageContext) => {
  const id: string = query.clip as string;

  try {
    const { data, errors } = await fetcher(`
      query {
        clip(contentId: "cid${id}") {
          directClipUrl
          contentTitle
          contentThumbnail
          createdTimestamp
        }
      }
    `).then((data) => data.json());

    return {
      id,
      clip: data?.clip,
      error:
        (!data?.clip && "Clip not found") || (errors && errors[0]?.message),
    };
  } catch (e) {
    return { error: "Clip not found" };
  }
};

export default ClipPage;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
`;

const VideoPlayer = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

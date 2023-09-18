import Image from "next/image";
import Link from "next/link";
import { UnsplashImages } from "../models/unsplash-images";
import { Alert } from "../components/bootstrap";

export const metadata = {
    title: 'Dynamic Image refreshing',
  }

export const revalidate = 0;
export default async function Page() {
    const response = await fetch("https://api.unsplash.com/photos/random?client_id=" + process.env.UNSPLASH_ACCESS_KEY);
    const image: UnsplashImages = await response.json();
    const width = Math.min(image.width, 500);
    const height = (width / image.width) * image.height;

    return (
        <div className="d-flex flex-column align-items-center">
            <Alert variant="primary">Dynamic shit only brother</Alert>
            <Image
                src={image.urls.raw}
                width={width}
                height={height}
                alt={image.description}
                className="rounded shadow-lg mw-100 h-100"
            /> By <Link href={"/users/" + image.user.username}> {image.user.username}</Link>
        </div>
    )
}
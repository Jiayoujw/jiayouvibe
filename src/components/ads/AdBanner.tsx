interface AdBannerProps {
  className?: string
}

/**
 * AdSense ad unit placeholder.
 * Renders the AdSense `<ins>` tag inside a centered container.
 *
 * Replace `data-ad-slot` with a real slot ID before going live.
 * The `data-ad-client` is set to the site's publisher ID.
 */
export default function AdBanner({ className }: AdBannerProps) {
  return (
    <div className={className ?? 'my-8 flex justify-center'}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5383848679722774"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

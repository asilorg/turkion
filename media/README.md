# Media archive and provenance

The public miniature gallery uses WebP derivatives in `public/miniatures-web`. All 300 original files are preserved byte for byte in `media/originals/miniatures`; they are not copied into the public deployment. `miniatures-manifest.json` records their SHA-256 hashes and exact public mapping. Old `/miniatures/...` image URLs redirect to their derivatives.

Run `pnpm media:prepare` to regenerate all derivatives: sharp 0.34.5, orientation applied, maximum width and height 1600, no enlargement, WebP quality 82. Run `pnpm media:check` to verify the archive count/hashes, WebP format, dimensions and nonempty files. Preparation preserves original bytes and rebuilds derivatives; it does not infer source metadata.

Original bytes: 953242000. Derivative bytes: 89545576 (90.61% reduction). Originals remain in Git, so repository history is intentionally not rewritten or reduced.

`content/media.yml` is the shared provenance catalog for all 428 miniature/flag assets. 186 records have an exact SHA-1 match against Wikimedia Commons imageinfo metadata queried on 2026-10-03. Those entries cite the file description page and transcribe its creator/license metadata when supplied. `commons-verification.json` preserves the paired hashes and source URLs. Exact bytes establish the file match; the Wikimedia source supplies the attribution statement.

The remaining 242 records are explicitly `unverified`: the source was not matched, a file differed, or metadata was unavailable. Names alone are not evidence of authorship, date, authenticity or reuse rights. Do not upgrade these entries by guessing. Match an authoritative source, record its URL and metadata, and preserve the verification evidence.

Historical flag reconstructions and catalog labels are identified separately from the image-file provenance. A verified image-file source does not prove an ancient polity used a particular flag.

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

/**
 * Upload direct navigateur → Vercel Blob (recommandé au-delà de ~4,5 Mo).
 * Prérequis : `vercel env pull` pour récupérer BLOB_READ_WRITE_TOKEN en local.
 *
 * Sécurité : sans auth ici, toute personne connaissant l’URL peut uploader.
 * En prod, ajoute une vérif dans onBeforeGenerateToken (session, secret header, etc.).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'image/jpeg',
            'image/png',
            'image/webp',
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ source: 'octovisual-upload' }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('[blob] upload completed', blob.url, tokenPayload)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

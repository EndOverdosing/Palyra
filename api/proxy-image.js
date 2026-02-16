export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.query;

    if (!url || !url.startsWith('https://mfjqbejulpkuoutgeuuw.supabase.co/')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.send(Buffer.from(buffer));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch image' });
    }
}
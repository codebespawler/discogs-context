// discogs-context.js
(function DiscogsContext() {
    if (!Spicetify.ContextMenu || !Spicetify.URI || !Spicetify.React || !Spicetify.ReactDOM || !Spicetify.PopupModal) {
        setTimeout(DiscogsContext, 200);
        return;
    }

    const { React } = Spicetify;

    const TOKEN_KEY = "discogs-access-token";
    const TOKEN_PAGE_URL = "https://www.discogs.com/settings/developers";

    // Spotify's own 16px icons, taken from its app bundle so the menu matches the native items.
    const spotifyIcon = (paths) => `<svg viewBox="0 0 16 16" fill="currentColor">${paths}</svg>`;
    const SEARCH_ICON = spotifyIcon(`<path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5M.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7"/>`);
    // Same icon as Spotify's "Go to album".
    const ALBUM_ICON = spotifyIcon(`<path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"/><path d="M8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M5 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0"/>`);
    // Same icon as Spotify's "Go to artist".
    const ARTIST_ICON = spotifyIcon(`<path d="M11.757 2.987A4.36 4.36 0 0 0 7.618 0a4.36 4.36 0 0 0-4.139 2.987 5.5 5.5 0 0 0-.22 1.894 5.6 5.6 0 0 0 1.4 3.312l.125.152a.748.748 0 0 1-.2 1.128l-2.209 1.275A4.75 4.75 0 0 0 0 14.857v1.142h8.734A5.5 5.5 0 0 1 8.15 14.5H1.517a3.25 3.25 0 0 1 1.6-2.454l2.21-1.275a2.25 2.25 0 0 0 .6-3.386l-.128-.153a4.1 4.1 0 0 1-1.05-2.44A4 4 0 0 1 4.89 3.47a2.8 2.8 0 0 1 1.555-1.713 2.89 2.89 0 0 1 3.293.691c.265.296.466.644.589 1.022.12.43.169.876.144 1.322a4.12 4.12 0 0 1-1.052 2.44l-.127.153a2.24 2.24 0 0 0-.2 2.58c.338-.45.742-.845 1.2-1.173 0-.162.055-.32.156-.447l.126-.152a5.6 5.6 0 0 0 1.4-3.312 5.5 5.5 0 0 0-.218-1.894zm3.493 3.771a.75.75 0 0 0-.75.75v3.496h-1a2.5 2.5 0 0 0-2.31 1.542 2.497 2.497 0 0 0 1.822 3.406A2.502 2.502 0 0 0 16 13.502V7.508a.75.75 0 0 0-.75-.75m-.75 6.744a.998.998 0 0 1-1.707.707 1 1 0 0 1 .707-1.706h1z"/>`);
    const TRACK_ICON = spotifyIcon(`<path d="M10 2v9.5a2.75 2.75 0 1 1-2.75-2.75H8.5V2zm-1.5 8.25H7.25A1.25 1.25 0 1 0 8.5 11.5z"/>`);
    // Same icon as Spotify's "Edit details".
    const EDIT_ICON = spotifyIcon(`<path d="M11.838.714a2.438 2.438 0 0 1 3.448 3.448l-9.841 9.841c-.358.358-.79.633-1.267.806l-3.173 1.146a.75.75 0 0 1-.96-.96l1.146-3.173c.173-.476.448-.909.806-1.267l9.84-9.84zm2.387 1.06a.94.94 0 0 0-1.327 0l-9.84 9.842a1.95 1.95 0 0 0-.456.716L2 14.002l1.669-.604a1.95 1.95 0 0 0 .716-.455l9.841-9.841a.94.94 0 0 0 0-1.327z"/>`);

    function TokenForm({ initialToken, onSave }) {
        const [token, setToken] = React.useState(initialToken);
        const save = () => onSave(token.trim());
        const SaveButton = Spicetify.ReactComponent?.ButtonPrimary ?? "button";

        return React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "12px" } },
            React.createElement("label", { htmlFor: "discogs-token-input" }, "Enter your Discogs Personal Access Token:"),
            React.createElement("input", {
                id: "discogs-token-input",
                type: "password",
                value: token,
                placeholder: "Paste token here...",
                autoFocus: true,
                onChange: (e) => setToken(e.target.value),
                onKeyDown: (e) => {
                    if (e.key === "Enter") save();
                },
                style: {
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid var(--spice-button-disabled)",
                    backgroundColor: "var(--spice-card)",
                    color: "var(--spice-text)",
                },
            }),
            React.createElement(
                "span",
                { style: { color: "var(--spice-subtext)" } },
                "Create one at ",
                React.createElement(
                    "a",
                    {
                        href: TOKEN_PAGE_URL,
                        style: { color: "var(--spice-text)", textDecoration: "underline" },
                        onClick: (e) => {
                            e.preventDefault();
                            window.open(TOKEN_PAGE_URL, "_blank");
                        },
                    },
                    "discogs.com/settings/developers"
                ),
                ". Save an empty box to clear it."
            ),
            React.createElement(
                "div",
                { style: { display: "flex", justifyContent: "flex-end" } },
                React.createElement(SaveButton, { onClick: save }, "Save Token")
            )
        );
    }

    function promptTokenModal(onSaved) {
        Spicetify.PopupModal.display({
            title: "Discogs API Token Setup",
            content: React.createElement(TokenForm, {
                initialToken: Spicetify.LocalStorage.get(TOKEN_KEY) || "",
                onSave: (token) => {
                    Spicetify.PopupModal.hide();
                    if (token) {
                        Spicetify.LocalStorage.set(TOKEN_KEY, token);
                        Spicetify.showNotification("Discogs Token Saved!");
                        if (onSaved) onSaved();
                    } else {
                        Spicetify.LocalStorage.remove(TOKEN_KEY);
                        Spicetify.showNotification("Discogs Token Cleared.");
                    }
                },
            }),
        });
    }

    async function getItemMetadata(uri) {
        const uriObj = Spicetify.URI.fromString(uri);
        const id = uriObj.id;

        try {
            if (Spicetify.GraphQL && Spicetify.GraphQL.Request && Spicetify.GraphQL.Definitions) {
                // Variables match what Spotify itself sends for each query.
                if (uriObj.type === Spicetify.URI.Type.TRACK && Spicetify.GraphQL.Definitions.getTrack) {
                    const res = await Spicetify.GraphQL.Request(Spicetify.GraphQL.Definitions.getTrack, { uri });
                    const track = res?.data?.trackUnion;
                    if (track) {
                        return {
                            name: track.name,
                            artists: track.firstArtist?.items?.map(a => ({ name: a.profile?.name || "" })) || [],
                            album: { name: track.albumOfTrack?.name || "" }
                        };
                    }
                } else if (uriObj.type === Spicetify.URI.Type.ALBUM && Spicetify.GraphQL.Definitions.getAlbum) {
                    const res = await Spicetify.GraphQL.Request(Spicetify.GraphQL.Definitions.getAlbum, {
                        uri,
                        locale: "",
                        offset: 0,
                        limit: 50
                    });
                    const album = res?.data?.albumUnion;
                    if (album) {
                        return {
                            name: album.name,
                            artists: album.artists?.items?.map(a => ({ name: a.profile?.name || "" })) || []
                        };
                    }
                } else if (uriObj.type === Spicetify.URI.Type.ARTIST && Spicetify.GraphQL.Definitions.queryArtistOverview) {
                    const res = await Spicetify.GraphQL.Request(Spicetify.GraphQL.Definitions.queryArtistOverview, {
                        uri,
                        locale: "",
                        preReleaseV2: false
                    });
                    const name = res?.data?.artistUnion?.profile?.name;
                    if (name) return { name };
                }
            }
        } catch (e) {
            console.warn("GraphQL API failed, falling back to Web API...", e);
        }

        try {
            if (uriObj.type === Spicetify.URI.Type.TRACK) {
                const track = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${id}`);
                return track ? { name: track.name, artists: track.artists, album: { name: track.album?.name } } : null;
            } else if (uriObj.type === Spicetify.URI.Type.ALBUM) {
                const album = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${id}`);
                return album ? { name: album.name, artists: album.artists } : null;
            } else if (uriObj.type === Spicetify.URI.Type.ARTIST) {
                const artist = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${id}`);
                return artist ? { name: artist.name } : null;
            }
        } catch (e) {
            console.error("Spotify Web API error (Likely 429 Rate Limit):", e);
            Spicetify.showNotification("Spotify metadata fetch failed. Rate limited?");
            return null;
        }
        return null;
    }

    function fetchDiscogsSearch(query, type, token) {
        return fetch(
            `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=${type}&token=${encodeURIComponent(token)}`
        );
    }

    async function searchDiscogs(query, type) {
        const token = Spicetify.LocalStorage.get(TOKEN_KEY);
        const fallbackUrl = `https://www.discogs.com/search/?q=${encodeURIComponent(query)}&type=${type}`;
        const retry = () => searchDiscogs(query, type);

        if (!token) {
            promptTokenModal(retry);
            return;
        }

        try {
            let res = await fetchDiscogsSearch(query, type, token);

            if (res.status === 401) {
                Spicetify.showNotification("Invalid Discogs Token. Please re-enter.");
                Spicetify.LocalStorage.remove(TOKEN_KEY);
                promptTokenModal(retry);
                return;
            }
            if (!res.ok) throw new Error(`Discogs search failed (HTTP ${res.status})`);

            let { results } = await res.json();

            if (!results?.length && type === "master") {
                res = await fetchDiscogsSearch(query, "release", token);
                if (res.ok) ({ results } = await res.json());
            }

            window.open(results?.length ? `https://www.discogs.com${results[0].uri}` : fallbackUrl, "_blank");
        } catch (err) {
            console.error("Discogs Extension Error:", err);
            window.open(fallbackUrl, "_blank");
        }
    }

    const menuItems = [
        new Spicetify.ContextMenu.Item(
            "Master Release",
            async (uris) => {
                const uri = uris[0];
                const meta = await getItemMetadata(uri);
                if (!meta) return;

                const artistName = meta.artists?.[0]?.name || "";
                const albumName = meta.album?.name || meta.name || "";

                if (artistName && albumName) {
                    searchDiscogs(`${artistName} - ${albumName}`, "master");
                }
            },
            (uris) => {
                if (uris.length !== 1) return false;
                const type = Spicetify.URI.fromString(uris[0]).type;
                return type === Spicetify.URI.Type.ALBUM || type === Spicetify.URI.Type.TRACK;
            },
            ALBUM_ICON
        ),
        new Spicetify.ContextMenu.Item(
            "Artist",
            async (uris) => {
                const uri = uris[0];
                const meta = await getItemMetadata(uri);
                if (!meta) return;

                const uriObj = Spicetify.URI.fromString(uri);
                let artistName = "";

                if (uriObj.type === Spicetify.URI.Type.ARTIST) {
                    artistName = meta.name;
                } else {
                    artistName = meta.artists?.[0]?.name || "";
                }

                if (artistName) searchDiscogs(artistName, "artist");
            },
            (uris) => uris.length === 1,
            ARTIST_ICON
        ),
        new Spicetify.ContextMenu.Item(
            "Track",
            async (uris) => {
                const uri = uris[0];
                const meta = await getItemMetadata(uri);
                if (!meta) return;

                const artistName = meta.artists?.[0]?.name || "";
                const trackName = meta.name || "";

                if (artistName && trackName) {
                    searchDiscogs(`${artistName} - ${trackName}`, "all");
                }
            },
            (uris) => {
                if (uris.length !== 1) return false;
                return Spicetify.URI.fromString(uris[0]).type === Spicetify.URI.Type.TRACK;
            },
            TRACK_ICON
        ),
        new Spicetify.ContextMenu.Item(
            "Change Discogs Token",
            () => promptTokenModal(),
            (uris) => uris.length === 1,
            EDIT_ICON
        )
    ];

    new Spicetify.ContextMenu.SubMenu(
        "Search on Discogs",
        menuItems,
        (uris) => {
            if (uris.length !== 1) return false;
            const type = Spicetify.URI.fromString(uris[0]).type;
            return (
                type === Spicetify.URI.Type.ARTIST ||
                type === Spicetify.URI.Type.ALBUM ||
                type === Spicetify.URI.Type.TRACK
            );
        },
        false,
        SEARCH_ICON
    ).register();
})();

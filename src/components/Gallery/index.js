import { useCallback, useRef, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';

const collectionQuery = (collection, pageIndex) => {
    return `{
    "filters": {
        "address": "${collection}",
        "traits": {},
        "searchText": "",
        "notForSale": false
    },
    "fields": {
        "address": 1,
        "name": 1,
        "id": 1,
        "imageUrl": 1,
        "currentPrice": 1,
        "currentUsdPrice": 1,
        "paymentToken": 1,
        "animationUrl": 1,
        "notForSale": 1,
        "rarity": 1
    },
    "limit": 25,
    "offset": ${pageIndex * 25}
    }`;
};

const fetchCollection = async (query) => {
    const res = await fetch('https://v2.api.genie.xyz/assets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: query,
    }).then((res) => res.json());

    if (!res.totalCount) {
        const error = new Error('Collection does not exist');
        throw error;
    }

    return res['data'];
};

function Gallery(props) {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null; // reached the end
        return props.collection ? collectionQuery(props.collection, pageIndex) : null;
    };

    const { data, error, mutate, size, setSize } = useSWRInfinite(getKey, fetchCollection);

    const tokens = data ? [].concat(...data) : [];
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');

    const observer = useRef();
    const lastElementRef = useCallback(
        (node) => {
            if (isLoadingMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setSize(size + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoadingMore]
    );

    if (!props.collection || error) return <div>Submit a valid collection address to see its available assets</div>;
    if (isLoadingInitialData) return <div>Loading...</div>;
    return (
        <>
            <div className="grid h-full mx-4 gap-2.5 place-items-center grid-cols-6">
                {tokens.map((token, i) => {
                    return (
                        <div key={i} ref={lastElementRef}>
                            <img src={token['imageUrl']} alt={token['tokenId']} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Gallery;

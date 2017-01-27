const url = require('url');
const { send, createError } = require('micro');
const { fetchUrl } = require('fetch');

module.exports = async function (req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    const { pathname, query } = url.parse(req.url, /* parseQueryString */ true);

    // remove the initial slash in path
    const externalUrl = pathname.substr(1);

    // helps with implicit things like favicon and accidental relative paths
    if(!/^http(s)?:\/\//i.test(externalUrl)){
        return createError(500, 'Please send an absolute url as the only parameter.');
    }

    fetchUrl(externalUrl, (err, meta, body)=>{

        if(err || meta.status !== 200 ){
            return createError(meta.status, 'Fetching url returned error', err);
        }

        const HTMLBody = body.toString();
        let lines = HTMLBody.split(/\n/g);
        let retVal;

        if(query._regexp){
            const rxParts = query._regexp.match(new RegExp('^/(.*?)/([gimy]*)$'));
            const rx = new RegExp(rxParts[1], rxParts[2]);

            retVal = {
                matches: lines.reduce(( matches, line, currentIndex)=>{

                    if(rx.test(line)){
                        matches.push({
                            line: line,
                            index: currentIndex
                        });
                    }
                    return matches;
                }, [])
            };

            retVal.count = retVal.matches.length;

        }else {
            retVal = {
                lines: lines,
                count: lines.length
            };
        }

        send(res, 200, retVal);
    });
}

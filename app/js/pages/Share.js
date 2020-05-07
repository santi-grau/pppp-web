import Page from './../Page'

class Share extends Page{
    constructor( p ){
        super( p )
        Object.values( document.querySelectorAll( '.share' ) ).forEach( b => {
            b.addEventListener( 'click', ( e ) => this.share() )
        })
    }

    share(){
        console.log('here')
        if (navigator.share) {
            navigator.share({
                title: 'Check it out!',
                text: 'Mi poster en public protest poster project',
                url: 'https://drive.google.com/uc?id=' + window.posterId
            })
        }
    }

    onEnterPage(){
        // if (navigator.canShare && navigator.share({url: url})  ) navigator.share({url: url});
    }
}

export { Share as default }
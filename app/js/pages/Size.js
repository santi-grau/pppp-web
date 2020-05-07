import Page from './../Page'

class Size extends Page{
    constructor( p ){
        super( p )

        this.scale = 1

        this.selectors = this.node.querySelectorAll( '.selector' )
        Object.values( this.selectors ).forEach( s => {
            s.addEventListener( 'click', ( e ) => this.selectSize( e ) )
        })
        
    }

    selectSize( e ){
        if( e.currentTarget.dataset.action == 'more' ) this.scale *= 1.2
        if( e.currentTarget.dataset.action == 'less' ) this.scale /= 1.2
        this.emit( 'updateFlow' , { action : 'sizeUpdate', data : this.scale } )
    }
}

export { Size as default }
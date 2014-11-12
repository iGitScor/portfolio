var sitemap = require('express-sitemap');

/***************************************************** 
 ***                     Sitemap
 *****************************************************/

exports.generateSitemap = function(url) {
    sitemap({
        url: url,
        map: {
            '/': ['get'],
            '/fr/': ['get'],
            '/fr/ma-personnalite': ['get'],
            '/fr/mon-reseau-social': ['get'],
            '/projets/knov': ['get'],
            '/projets/js13k': ['get'],
            '/fr/contact/formulaire-de-contact': ['get', 'post'],
            '/fr/contact/formulaire-embauche': ['get', 'post'],
            '/resources/CORREAUD-Curriculum_vitae.pdf': ['get'],
        },
        route: {
            '/': {
                changefreq: 'daily',
                priority: 1.0,
            },
            '/fr/': {
                changefreq: 'daily',
                priority: 1.0,
            },
            '/fr/ma-personnalite': {
                changefreq: 'daily',
                priority: 0.8,
            },
            '/fr/mon-reseau-social': {
                changefreq: 'daily',
                priority: 0.9,
            },
            '/projets/knov': {
                changefreq: 'daily',
                priority: 0.7,
            },
            '/projets/js13k': {
                changefreq: 'daily',
                priority: 0.7,
            },
            '/fr/contact/formulaire-de-contact': {
                changefreq: 'daily',
                priority: 0.5,
            },
            '/fr/contact/formulaire-embauche': {
                changefreq: 'daily',
                priority: 0.5,
            },
            '/resources/CORREAUD-Curriculum_vitae.pdf': {
                changefreq: 'daily',
                priority: 0.5,
            },
        },
    }).XMLtoFile();
};

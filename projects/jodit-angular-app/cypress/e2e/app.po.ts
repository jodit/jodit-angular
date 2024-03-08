
export class AppPage {
    navigateTo() {
        return cy.visit('/');
    }

    getJoditContainer() {
        return cy.get('.jodit-container');
    }

    getJoditWorkplace() {
        return cy.get('.jodit-workplace');
    }
}

export const INTROITEMS = [
    {
        title:
            'Welcome to CoSMOS!',
        content:
            'NASA’s Space Communications and Navigation Program is working to transform communication services for NASA missions ' +
            'from NASA-owned to commercially-provided capabilities. <ul><li>Goal 1: Expand commercial direct to Earth services to 100% in 2023</li>' +
            '<li>Goal 2: Demonstrate and operationalize commercial space-based relay services for future missions by 2030</li></ul>' +
            'In this context, Commercial Systems for Mission Operations Suitability (CoSMOS) is designed to facilitate exploration of commercial system capability and potential application to mission needs.'
    },
    {
        title: 'Explore Networks',
        content:
            'The Explore Networks feature is intended to allow the user to:' +
            '<ul><li>Learn about commercial networks</li>' +
            '<li>Understand performance and capabilities</li>' +
            '<li>Provide access to underlying models and data as applicable</li></ul>'
    },
    {
        title: 'Analyze',
        content:
            'The Analyze feature is intended to allow the user to:' +
            '<ul><li>Compare return link performance results for systems based on a user mission profile and communications needs</li>' +
            '<li>See ranked results</li>' +
            '<li>Explore tabular and graphical comparisons</li></ul>'
    },
    {
        title: 'CoSMOS Development Status and Evolution',
        content:
            'CoSMOS is an evolving tool. This page briefly provides some context for the current state of the tool in relation to long-term potential capability. Comments and suggestions for future utility are welcome. Please contact <a href=\'mailto:cosmoshelp@teltrium.com\'>cosmoshelp@teltrium.com</a>.' +
            '<br/><br/><b>Systems:</b> CoSMOS includes both space-based relay systems and ground networks. The space-based configurations are representative and future models may capture alternatives. By way of example, the O3b model is a 7-satellite configuration representing the proposed mPOWER capability, but SES/O3b have several other existing and subsequently planned satellites. Information is based on publicly available data including from FCC filings and corporate literature / websites.' +
            '<br/><br/><b>Users:</b> CoSMOS currently allows for user orbital configurations which are circular Earth orbits. Terrestrial users, e.g. the ability to run cases for the NSF location at the South Pole, have been added, but the capability is still evolving.' +
            '<br/><br/><b>Analysis Capabilities and Features:</b> A reporting capability has been added that allows the user to download Word documents that contain data and analytical results from CoSMOS. The user burden evaluation approach has recently been expanded and updated, and link budgets have been included for the return link. An orbit visualizer that allows the user to see and interact with both a 3D and a 2D viewer has been deployed, and leverages NASA’s WorldWind visualization framework. Access to the underlying models are available for download.' +
            '<br/><br/><b>Regression Models:</b> CoSMOS uses regression analysis to predict communication service performance without requiring lengthy and complex simulation. As development of CoSMOS continues, this predictive capability will evolve to provide improved accuracy and allow users to supply their own data and regression methodology. As such, the current predictions should not be considered a final product, and should be expected to change as methodology and data availability improves.' +
            '<br/><br/><b>Interface Advancements:</b> We are continuously working to make the interface and user experience positive, and we welcome feedback. The UI has recently been redesigned to improve workflow and ease the user experience, and the ability to toggle between a light and a dark mode has been included.' +
            '<br/><br/><b>Example Improvements and Bug Fixes Under Development:</b><ul>' +
            '<li>The regression process is being continually improved and is still under development. Current models may result in projections that are not self-consistent, e.g., effective communications time exceeding RF coverage, or average gap exceeding max gap.</li>' +
            '<li>Bug in plots for non-numeric results (e.g. true / false) such as feasibility of accommodating pointing rates.</li>' +
            '<li>Bug in the NS3 post-processing that affects high altitude users that is a direct result of flickering phenomenon.</li>' +
            '</ul>' +
            '<br/><br/><b>Example Future Work Items:</b>' +
            '<ul>' +
            '<li>Migrating to NASA enterprise hosting.</li>' +
            '<li>Add alternative ranking algorithms for network comparison.</li>' +
            '<li>The addition of new commercial relay systems, or variants of the currently modeled systems; in particular, potential for including systems/variants based on respondents to the CSP demonstration solicitation.</li>' +
            '<li>Consideration for evaluating blended network solutions including a combination of relay satellites and ground stations.</li>' +
            '<li>Error estimation for regression predictions.</li>' + 
            '<li>Recommendation for “best” selection of ground stations to optimize coverage.</li>' + 
            '</ul>'
    }
];

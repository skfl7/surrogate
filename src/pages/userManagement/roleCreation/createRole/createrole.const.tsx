
export const duplicateRoleData = {
  actionsAllowed :[
  {
      code: "PRODUCT_MANAGEMENT",
      name: "Product Management",
      roleAccess: "YES",
      subAction: [
          {
              code: "PROGRAM_MANAGEMENT",
              name: "Program Management",
              roleAccess: "YES",
              secondSubActions: [
                  {
                      code: "PASS_RESUME_PROGRAM",
                      name: "PASS RESUME PROGRAM",
                      roleAccess: "YES",
                      defaultEnable: "NO"
                  }
              ]
          },
          {
              code: "CARD_CATALOGUE",
              name: "Card catalogue",
              roleAccess: "YES",
              secondSubActions: [
                  {
                      code: "BULK_UPLOAD_CARD",
                      name: "BULK UPLOAD CARD",
                      roleAccess: "YES",
                      defaultEnable: "NO"
                  }
              ]
          },
          {
              code: "CREDIT_RULE",
              name: "Credit rule",
              roleAccess: "YES",
            secondSubActions: [
                  {
                      code: "CREATE_CREDIT_RULE",
                      name: "CREATE CREDIT RULE",
                      roleAccess: "YES",
                      defaultEnable: "NO"
                  }
              ]
          }
      ]
  }
] }


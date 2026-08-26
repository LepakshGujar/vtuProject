import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        source: {
            type: String,
            enum: [
                "JSEARCH",
                "JOOBLE",
                "LINKEDIN",
                "INDEED",
                "NAUKRI",
                "GLASSDOOR",
                "FOUNDIT",
                "INTERNSHALA",
                "WELLFOUND",
                "REMOTEOK",
                "COMPANY_CAREERS"
            ],
            required: true
        },

        externalJobId: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        companyLogo: {
            type: String,
            default: ""
        },

        companyWebsite: {
            type: String,
            default: ""
        },

        publisher: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        location: {
            city: {
                type: String,
                default: ""
            },

            state: {
                type: String,
                default: ""
            },

            country: {
                type: String,
                default: ""
            },

            fullLocation: {
                type: String,
                default: ""
            },

            latitude: Number,

            longitude: Number
        },

        employmentType: {
            type: String,
            default: ""
        },

        salary: {
            min: Number,

            max: Number,

            currency: {
                type: String,
                default: ""
            },

            period: {
                type: String,
                default: ""
            },

            text: {
                type: String,
                default: "Not Specified"
            }
        },

        experience: {
            type: String,
            default: ""
        },

        skills: [
            {
                type: String
            }
        ],

        technologies: [
            {
                type: String
            }
        ],

        applyLink: {
            type: String,
            default: ""
        },

        postedDate: Date,

        isRemote: {
            type: Boolean,
            default: false
        },

        raw: {
            type: Object
        }
    },
    {
        timestamps: true
    }
);

jobSchema.index(
    {
        source: 1,
        externalJobId: 1
    },
    {
        unique: true
    }
);

export default mongoose.model("Job", jobSchema);
const mapJSearchJob = (job) => {

    return {

        source: "JSEARCH",

        externalJobId: job.job_id,

        title: job.job_title,

        company: job.employer_name,

        companyLogo: job.employer_logo || "",

        companyWebsite: job.employer_website || "",

        publisher: job.job_publisher || "",

        description: job.job_description || "",

        location: {

            city: job.job_city || "",

            state: job.job_state || "",

            country: job.job_country || "",

            fullLocation: job.job_location || "",

            latitude: job.job_latitude || null,

            longitude: job.job_longitude || null

        },

        employmentType: job.job_employment_type || "",

        salary: {

            min: job.job_min_salary || null,

            max: job.job_max_salary || null,

            currency: job.job_salary_currency || "",

            period: job.job_salary_period || "",

            text: job.job_salary_string || "Not Specified"

        },

        experience: "",

        skills: [],

        technologies: [],

        applyLink: job.job_apply_link || "",

        postedDate: job.job_posted_at_datetime_utc
            ? new Date(job.job_posted_at_datetime_utc)
            : null,

        isRemote: job.job_is_remote || false,

        raw: job
    };

};

export default mapJSearchJob;
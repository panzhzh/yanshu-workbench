import type { PaperStyleId } from "./types";

export type ReconstructionVenueTier = "A" | "B";

export interface ReconstructionVenuePreset {
  id: string;
  tier: ReconstructionVenueTier;
  shortName: string;
  fullName: string;
}

export const CUSTOM_RECONSTRUCTION_VENUE_ID = "custom";

export const RECONSTRUCTION_VENUE_REFERENCE = {
  edition: "CCF 7th edition (2026)",
  url: "https://www.ccf.org.cn/Academic_Evaluation/By_category/",
} as const;

export const RECONSTRUCTION_VENUES = {
  conference: [
    { id: "aaai", tier: "A", shortName: "AAAI", fullName: "AAAI Conference on Artificial Intelligence" },
    { id: "neurips", tier: "A", shortName: "NeurIPS", fullName: "Conference on Neural Information Processing Systems" },
    { id: "acl", tier: "A", shortName: "ACL", fullName: "Annual Meeting of the Association for Computational Linguistics" },
    { id: "cvpr", tier: "A", shortName: "CVPR", fullName: "IEEE/CVF Conference on Computer Vision and Pattern Recognition" },
    { id: "iccv", tier: "A", shortName: "ICCV", fullName: "IEEE/CVF International Conference on Computer Vision" },
    { id: "icml", tier: "A", shortName: "ICML", fullName: "International Conference on Machine Learning" },
    { id: "ijcai", tier: "A", shortName: "IJCAI", fullName: "International Joint Conference on Artificial Intelligence" },
    { id: "sigmod", tier: "A", shortName: "SIGMOD", fullName: "ACM SIGMOD Conference" },
    { id: "sigkdd", tier: "A", shortName: "SIGKDD", fullName: "ACM SIGKDD Conference on Knowledge Discovery and Data Mining" },
    { id: "icde", tier: "A", shortName: "ICDE", fullName: "IEEE International Conference on Data Engineering" },
    { id: "sigir", tier: "A", shortName: "SIGIR", fullName: "International ACM SIGIR Conference on Research and Development in Information Retrieval" },
    { id: "vldb", tier: "A", shortName: "VLDB", fullName: "International Conference on Very Large Data Bases" },
    { id: "www", tier: "A", shortName: "WWW", fullName: "The Web Conference" },
    { id: "ccs", tier: "A", shortName: "CCS", fullName: "ACM Conference on Computer and Communications Security" },
    { id: "sp", tier: "A", shortName: "IEEE S&P", fullName: "IEEE Symposium on Security and Privacy" },
    { id: "usenix-security", tier: "A", shortName: "USENIX Security", fullName: "USENIX Security Symposium" },
    { id: "ndss", tier: "A", shortName: "NDSS", fullName: "Network and Distributed System Security Symposium" },
    { id: "pldi", tier: "A", shortName: "PLDI", fullName: "ACM SIGPLAN Conference on Programming Language Design and Implementation" },
    { id: "popl", tier: "A", shortName: "POPL", fullName: "ACM SIGPLAN Symposium on Principles of Programming Languages" },
    { id: "fse", tier: "A", shortName: "FSE", fullName: "ACM International Conference on the Foundations of Software Engineering" },
    { id: "icse", tier: "A", shortName: "ICSE", fullName: "International Conference on Software Engineering" },
    { id: "fast", tier: "A", shortName: "FAST", fullName: "USENIX Conference on File and Storage Technologies" },
    { id: "hpca", tier: "A", shortName: "HPCA", fullName: "IEEE International Symposium on High-Performance Computer Architecture" },
    { id: "micro", tier: "A", shortName: "MICRO", fullName: "IEEE/ACM International Symposium on Microarchitecture" },
    { id: "sc", tier: "A", shortName: "SC", fullName: "International Conference for High Performance Computing, Networking, Storage, and Analysis" },
    { id: "stoc", tier: "A", shortName: "STOC", fullName: "ACM Symposium on Theory of Computing" },
    { id: "soda", tier: "A", shortName: "SODA", fullName: "ACM-SIAM Symposium on Discrete Algorithms" },
    { id: "cav", tier: "A", shortName: "CAV", fullName: "International Conference on Computer Aided Verification" },
    { id: "focs", tier: "A", shortName: "FOCS", fullName: "IEEE Symposium on Foundations of Computer Science" },
    { id: "lics", tier: "A", shortName: "LICS", fullName: "ACM/IEEE Symposium on Logic in Computer Science" },
    { id: "colt", tier: "B", shortName: "COLT", fullName: "Conference on Learning Theory" },
    { id: "emnlp", tier: "B", shortName: "EMNLP", fullName: "Conference on Empirical Methods in Natural Language Processing" },
    { id: "ecai", tier: "B", shortName: "ECAI", fullName: "European Conference on Artificial Intelligence" },
    { id: "eccv", tier: "B", shortName: "ECCV", fullName: "European Conference on Computer Vision" },
    { id: "icra", tier: "B", shortName: "ICRA", fullName: "IEEE International Conference on Robotics and Automation" },
    { id: "icaps", tier: "B", shortName: "ICAPS", fullName: "International Conference on Automated Planning and Scheduling" },
    { id: "cikm", tier: "B", shortName: "CIKM", fullName: "ACM International Conference on Information and Knowledge Management" },
    { id: "acsac", tier: "B", shortName: "ACSAC", fullName: "Annual Computer Security Applications Conference" },
    { id: "asiacrypt", tier: "B", shortName: "ASIACRYPT", fullName: "International Conference on the Theory and Application of Cryptology and Information Security" },
    { id: "esorics", tier: "B", shortName: "ESORICS", fullName: "European Symposium on Research in Computer Security" },
    { id: "dsn", tier: "B", shortName: "DSN", fullName: "International Conference on Dependable Systems and Networks" },
    { id: "cogsci", tier: "B", shortName: "CogSci", fullName: "Annual Meeting of the Cognitive Science Society" },
    { id: "bibm", tier: "B", shortName: "BIBM", fullName: "IEEE International Conference on Bioinformatics and Biomedicine" },
    { id: "emsoft", tier: "B", shortName: "EMSOFT", fullName: "International Conference on Embedded Software" },
  ],
  journal: [
    { id: "ai", tier: "A", shortName: "AI", fullName: "Artificial Intelligence" },
    { id: "tpami", tier: "A", shortName: "TPAMI", fullName: "IEEE Transactions on Pattern Analysis and Machine Intelligence" },
    { id: "ijcv", tier: "A", shortName: "IJCV", fullName: "International Journal of Computer Vision" },
    { id: "jmlr", tier: "A", shortName: "JMLR", fullName: "Journal of Machine Learning Research" },
    { id: "tods", tier: "A", shortName: "TODS", fullName: "ACM Transactions on Database Systems" },
    { id: "tois", tier: "A", shortName: "TOIS", fullName: "ACM Transactions on Information Systems" },
    { id: "tkde", tier: "A", shortName: "TKDE", fullName: "IEEE Transactions on Knowledge and Data Engineering" },
    { id: "vldbj", tier: "A", shortName: "VLDBJ", fullName: "The VLDB Journal" },
    { id: "tog", tier: "A", shortName: "TOG", fullName: "ACM Transactions on Graphics" },
    { id: "tip", tier: "A", shortName: "TIP", fullName: "IEEE Transactions on Image Processing" },
    { id: "tvcg", tier: "A", shortName: "TVCG", fullName: "IEEE Transactions on Visualization and Computer Graphics" },
    { id: "tdsc", tier: "A", shortName: "TDSC", fullName: "IEEE Transactions on Dependable and Secure Computing" },
    { id: "tifs", tier: "A", shortName: "TIFS", fullName: "IEEE Transactions on Information Forensics and Security" },
    { id: "journal-of-cryptology", tier: "A", shortName: "JoC", fullName: "Journal of Cryptology" },
    { id: "tocs", tier: "A", shortName: "TOCS", fullName: "ACM Transactions on Computer Systems" },
    { id: "tos", tier: "A", shortName: "TOS", fullName: "ACM Transactions on Storage" },
    { id: "tcad", tier: "A", shortName: "TCAD", fullName: "IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems" },
    { id: "tc", tier: "A", shortName: "TC", fullName: "IEEE Transactions on Computers" },
    { id: "tpds", tier: "A", shortName: "TPDS", fullName: "IEEE Transactions on Parallel and Distributed Systems" },
    { id: "taco", tier: "A", shortName: "TACO", fullName: "ACM Transactions on Architecture and Code Optimization" },
    { id: "tit", tier: "A", shortName: "TIT", fullName: "IEEE Transactions on Information Theory" },
    { id: "jacm", tier: "A", shortName: "JACM", fullName: "Journal of the ACM" },
    { id: "tap", tier: "B", shortName: "TAP", fullName: "ACM Transactions on Applied Perception" },
    { id: "aamas", tier: "B", shortName: "AAMAS", fullName: "Autonomous Agents and Multi-Agent Systems" },
    { id: "computational-linguistics", tier: "B", shortName: "CL", fullName: "Computational Linguistics" },
    { id: "cviu", tier: "B", shortName: "CVIU", fullName: "Computer Vision and Image Understanding" },
    { id: "tkdd", tier: "B", shortName: "TKDD", fullName: "ACM Transactions on Knowledge Discovery from Data" },
    { id: "tweb", tier: "B", shortName: "TWEB", fullName: "ACM Transactions on the Web" },
    { id: "aei", tier: "B", shortName: "AEI", fullName: "Advanced Engineering Informatics" },
    { id: "dke", tier: "B", shortName: "DKE", fullName: "Data & Knowledge Engineering" },
    { id: "dmkd", tier: "B", shortName: "DMKD", fullName: "Data Mining and Knowledge Discovery" },
    { id: "tomm", tier: "B", shortName: "TOMM", fullName: "ACM Transactions on Multimedia Computing, Communications, and Applications" },
    { id: "cgf", tier: "B", shortName: "CGF", fullName: "Computer Graphics Forum" },
    { id: "tcsvt", tier: "B", shortName: "TCSVT", fullName: "IEEE Transactions on Circuits and Systems for Video Technology" },
    { id: "tmm", tier: "B", shortName: "TMM", fullName: "IEEE Transactions on Multimedia" },
    { id: "tops", tier: "B", shortName: "TOPS", fullName: "ACM Transactions on Privacy and Security" },
    { id: "computers-security", tier: "B", shortName: "C&S", fullName: "Computers & Security" },
    { id: "designs-codes-cryptography", tier: "B", shortName: "DCC", fullName: "Designs, Codes and Cryptography" },
    { id: "jcs", tier: "B", shortName: "JCS", fullName: "Journal of Computer Security" },
  ],
} as const satisfies Record<PaperStyleId, readonly ReconstructionVenuePreset[]>;

export function formatReconstructionVenueName(
  venue: ReconstructionVenuePreset,
) {
  return venue.shortName === venue.fullName
    ? venue.fullName
    : `${venue.shortName} — ${venue.fullName}`;
}
